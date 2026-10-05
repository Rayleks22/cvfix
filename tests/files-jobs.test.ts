import { describe, expect, it } from 'vitest';
import { validateDocxArchive, validateFile } from '../src/lib/files.ts';
import { assertPDFFontCoverage } from '../src/lib/export.ts';
import { salaryPeriodLabel, safeJobURL } from '../src/lib/jobs.ts';

describe('safe upload validation', () => {
  it.each(['pdf', 'docx', 'txt'])('supports %s', (extension) => {
    expect(validateFile({ name: `cv.${extension}`, size: 100 })).toBe(extension);
  });
  it('accepts uppercase extensions', () => {
    expect(validateFile({ name: 'CV.DOCX', size: 200 })).toBe('docx');
  });
  it('rejects legacy DOC with an actionable message', () => {
    expect(() => validateFile({ name: 'cv.doc', size: 100 })).toThrow(/Save it as/);
  });
  it('rejects unsupported formats and empty files', () => {
    expect(() => validateFile({ name: 'cv.exe', size: 100 })).toThrow(/PDF, DOCX, or TXT/);
    expect(() => validateFile({ name: 'cv.pdf', size: 0 })).toThrow(/empty/);
  });
  it('enforces the advertised 5 MB limit', () => {
    expect(() => validateFile({ name: 'cv.docx', size: 5 * 1024 * 1024 + 1 })).toThrow(/over 5 MB/);
  });
  it('rejects renamed random data as a Word document', () => {
    expect(() =>
      validateDocxArchive(new TextEncoder().encode('not really a word document').buffer),
    ).toThrow(/could not be read/);
  });
});
describe('honest salary periods and listing links', () => {
  it('does not convert a salary range into a monthly amount', () => {
    expect(salaryPeriodLabel('$80k - $150k')).toContain('period not specified');
  });
  it('keeps annual, monthly and hourly units distinct', () => {
    expect(salaryPeriodLabel('$80k per year')).toContain('per year');
    expect(salaryPeriodLabel('$2,500/mo')).toContain('per month');
    expect(salaryPeriodLabel('$50-$75 /hour')).toContain('per hour');
  });
  it('only links to the expected HTTPS source', () => {
    expect(safeJobURL('https://remotive.com/remote-jobs/test')).toBeTruthy();
    expect(safeJobURL('javascript:alert(1)')).toBeNull();
    expect(safeJobURL('https://remotive.com.evil.example/')).toBeNull();
  });
});

describe('PDF font fidelity', () => {
  it('supports Nigerian names, naira, dashes and normal bullets', () => {
    expect(() => assertPDFFontCoverage('Ọlá Adé • ₦65,000 – CV')).not.toThrow();
  });
  it('does not silently lose unsupported characters', () => {
    expect(() => assertPDFFontCoverage('Example 😀')).toThrow(/Word download/);
  });
});
