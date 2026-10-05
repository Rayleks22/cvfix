export function salaryPeriodLabel(salary: string): string {
  if (/(?:\/\s*(?:hour|hr|h)\b|per hour|hourly)/i.test(salary)) return 'per hour · employer-listed';
  if (/(?:\/\s*(?:month|mo)\b|per month|monthly)/i.test(salary))
    return 'per month · employer-listed';
  if (/(?:\/\s*(?:year|yr)\b|per year|per annum|annual|yearly)/i.test(salary))
    return 'per year · employer-listed';
  return 'employer-listed · period not specified';
}
export function safeJobURL(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['remotive.com', 'www.remotive.com'].includes(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
