import { describe, expect, it } from 'vitest';
import {
  containsSkill,
  headingKind,
  improveBullet,
  normaliseCV,
  reviewCV,
  validateReviewInput,
} from '../src/lib/review.ts';
import { buildFullPackage } from '../server/documents.ts';
import { SAMPLE_PACKAGE } from '../src/data/samplePackage.ts';
import { SAMPLE_CV, SAMPLE_JOB_DESCRIPTION, SAMPLE_ROLE } from '../src/data/sampleCV.ts';
import { MAX_CV_CHARS } from '../src/lib/constants.ts';

const input = { cvText: SAMPLE_CV, targetRole: SAMPLE_ROLE, jobDescription: '' };
describe('grounded CV review', () => {
  it('rejects an empty CV instead of silently using a sample', () => {
    expect(() => reviewCV({ ...input, cvText: '' })).toThrow(/add your CV/);
  });
  it('rejects oversized text without silently truncating', () => {
    expect(() => validateReviewInput({ ...input, cvText: 'a'.repeat(MAX_CV_CHARS + 1) })).toThrow(
      /too long/,
    );
  });
  it('rejects binary-looking document text', () => {
    expect(() => reviewCV({ ...input, cvText: 'PK\x03\x04'.repeat(100) })).toThrow(/document data/);
  });
  it('normalises line endings without losing qualifications or dates', () => {
    expect(normaliseCV('HND\r\n2022 – Present\rNYSC')).toBe('HND\n2022 – Present\nNYSC');
  });
  it('does not mistake a college of Technology for a software role', () => {
    const result = reviewCV({
      ...input,
      cvText: SAMPLE_CV.replace('Example Polytechnic', 'Yaba College of Technology'),
    });
    expect(result.keywordGaps).not.toContain('TypeScript');
    expect(result.keywordGaps).not.toContain('CI/CD');
    expect(result.targetRole).toBe(SAMPLE_ROLE);
  });
  it('prioritises the explicit target role over the education text', () => {
    const result = reviewCV({ ...input, targetRole: 'Virtual Assistant' });
    expect(result.keywordGaps).toContain('Calendar management');
    expect(result.keywordGaps).not.toContain('React');
  });
  it('uses exact boundaries, not substring tech or admin matches', () => {
    expect(containsSkill('College of Technology', 'Git')).toBe(false);
    expect(containsSkill('administration', 'CRM')).toBe(false);
    expect(containsSkill('Using Excel for records', 'Microsoft Excel')).toBe(true);
  });
  it('only compares recognised skills actually in the job description', () => {
    const result = reviewCV({ ...input, jobDescription: SAMPLE_JOB_DESCRIPTION });
    expect(result.keywordSource).toBe('job-description');
    expect(result.keywordGaps).toContain('Zendesk');
    expect(result.keywordGaps).toContain('CRM');
    expect(result.keywordGaps).not.toContain('TypeScript');
    expect(result.pillars[3].label).toBe('Job keywords');
  });
  it('does not score optional role ideas as missing requirements', () => {
    const result = reviewCV(input);
    expect(result.keywordSource).toBe('role-ideas');
    expect(result.pillars[3].label).toBe('Core details');
  });
  it('discloses when a description has no vocabulary match', () => {
    const result = reviewCV({
      ...input,
      jobDescription: 'A specialist position in a discipline outside this vocabulary.',
    });
    expect(result.pillars[3].label).toBe('Core details');
    expect(result.suggestions.some((item) => item.id === 'unrecognised-jd')).toBe(true);
  });
  it('provides equally weighted, explainable category scores', () => {
    const result = reviewCV(input);
    expect(result.pillars).toHaveLength(4);
    expect(result.score).toBe(
      Math.round(result.pillars.reduce((sum, pillar) => sum + pillar.score, 0) / 4),
    );
    expect(
      result.pillars.every(
        (item) => item.score >= 0 && item.score <= 100 && item.explanation.length > 20,
      ),
    ).toBe(true);
  });
  it('does not invent a fixed number of problems or a fixed grade', () => {
    const result = reviewCV(input);
    expect(result).not.toHaveProperty('grade');
    expect(result).not.toHaveProperty('criticalFlags');
    expect(result.suggestions.every((item) => item.description && item.title)).toBe(true);
  });
  it('never returns guessed salaries, fabricated jobs, or a paid package with the free review', () => {
    const result = JSON.stringify(reviewCV(input));
    expect(result).not.toMatch(/salary|matchedRemoteJobs|premiumFullRewrite|98\.4|250,000/i);
  });
  it('changes responsibility-led wording without adding metrics', () => {
    expect(
      improveBullet('Responsible for daily customer service and addressing customer complaints.'),
    ).toBe('Provided daily customer service and addressed customer complaints.');
    expect(
      improveBullet('Responsible for managing 20 invoices and tracking payment records.'),
    ).toBe('Managed 20 invoices and tracked payment records.');
  });
  it('does not guess a new action for unfamiliar noun responsibilities', () => {
    expect(improveBullet('Responsible for stakeholder governance.')).toBe(
      'Responsible for stakeholder governance.',
    );
  });
  it('keeps supplied percentages and non-Latin text', () => {
    expect(improveBullet('Handled ₦65,000 using POS terminals.')).toBe(
      'Handled ₦65,000 using POS terminals.',
    );
    expect(normaliseCV('Ọlá Adé\nÉducation')).toBe('Ọlá Adé\nÉducation');
  });
  it('only supplies a rewrite grounded in an actual source line', () => {
    const change = reviewCV(input).sampleRewrite!;
    expect(SAMPLE_CV).toContain(change.original);
    expect(change.revised).not.toMatch(/\d/);
  });
  it('identifies normal section headings and does not treat a qualification as a heading', () => {
    expect(headingKind('EDUCATION & CERTIFICATIONS')).toBe('education');
    expect(headingKind('Projects')).toBe('experience');
    expect(headingKind('Higher National Diploma (HND)')).toBeNull();
  });
});

describe('complete, factual document package', () => {
  it('preserves the whole work history, employers, dates, NYSC and qualifications', () => {
    const value = buildFullPackage(input);
    for (const fact of [
      'AMARA OKAFOR',
      'amara@example.com',
      'Example Finance Agency',
      '2022 – Present',
      'Example Retail Store',
      '2019 – 2021',
      'Higher National Diploma (HND)',
      'NYSC Corps Member (Administrative & Teaching Assistant)',
      'Certificate of National Service',
    ])
      expect(value.cvText).toContain(fact);
    expect(value.cvText).not.toContain('candidate.career@gmail.com');
    expect(value.cvText).not.toContain('Associate Operations Specialist');
  });
  it('does not put missing skills into the CV or cover letter', () => {
    const value = buildFullPackage({ ...input, jobDescription: SAMPLE_JOB_DESCRIPTION });
    expect(value.cvText).not.toContain('Zendesk');
    expect(value.coverLetter).not.toContain('Zendesk');
    expect(value.coverLetter).not.toMatch(/fiber|backup power|international teams|35%/);
  });
  it('has no numbers in its changes that were not supplied', () => {
    const value = buildFullPackage(input);
    const before = input.cvText.match(/\d[\d,.]*/g);
    expect(value.cvText.match(/\d[\d,.]*/g)).toEqual(before);
  });
  it('keeps every original non-experience line intact', () => {
    const value = buildFullPackage(input);
    const before = normaliseCV(input.cvText).split('\n');
    const after = value.cvText.split('\n');
    const changed = new Set(value.changes.map((item) => item.lineIndex));
    before.forEach((line, index) => {
      if (!changed.has(index)) expect(after[index]).toBe(line);
    });
  });
});

it('ships only a fixed fictional sample package in the client', () => {
  expect(SAMPLE_PACKAGE).toEqual(buildFullPackage(input));
});
