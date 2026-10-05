import { describe, expect, it } from 'vitest';
import { mapCategory, transformJob } from '../scripts/fetch-remote-jobs.js';
const source = {
  id: 123,
  title: 'Customer Support Officer',
  company_name: 'Example Employer',
  candidate_required_location: 'Worldwide',
  url: 'https://remotive.com/remote-jobs/test-123',
  publication_date: '2026-10-01',
  description: '<p>Support <strong>customers</strong>.</p>',
  salary: '',
  category: 'Customer Service',
  tags: ['Customer service'],
  job_type: 'full_time',
};
const fetchedAt = '2026-10-02T00:00:00.000Z';
describe('source job ingestion', () => {
  it('does not manufacture a salary for a job that has none', () => {
    const result = transformJob(source, fetchedAt);
    expect(result.salary).toBeNull();
    expect(result).not.toHaveProperty('salaryNaira');
    expect(result).not.toHaveProperty('isVerified');
    expect(result).not.toHaveProperty('postedTime');
  });
  it('preserves the original salary and its period without conversion', () => {
    expect(transformJob({ ...source, salary: '$80k - $150k per year' }, fetchedAt).salary).toBe(
      '$80k - $150k per year',
    );
  });
  it('records actual source and fetch dates rather than Verified Today', () => {
    const result = transformJob(source, fetchedAt);
    expect(result.publishedAt).toBe('2026-10-01T00:00:00.000Z');
    expect(result.fetchedAt).toBe(fetchedAt);
    expect(result.source).toBe('Remotive');
  });
  it('does not claim blank or US-only locations are open to Nigeria', () => {
    expect(transformJob({ ...source, candidate_required_location: '' }, fetchedAt)).toBeNull();
    expect(
      transformJob({ ...source, candidate_required_location: 'USA only' }, fetchedAt),
    ).toBeNull();
  });
  it('removes source HTML and keeps a trusted source link', () => {
    expect(transformJob(source, fetchedAt).description).toBe('Support customers.');
    expect(transformJob({ ...source, url: 'javascript:alert(1)' }, fetchedAt)).toBeNull();
  });
  it('does not miscategorise sales or data roles as writing', () => {
    expect(mapCategory('Sales', 'Inside Sales Contractor')).toBe('Sales & Marketing');
    expect(mapCategory('Engineering', 'Data Engineer')).toBe('Data & AI');
  });
});
