import type { ReviewInput, ReviewResult } from '../types/index.ts';
import { MAX_CV_CHARS, MAX_JOB_CHARS, MAX_ROLE_CHARS, MIN_CV_CHARS } from './constants.ts';

/** A transparent, deterministic text review. It does not simulate a proprietary ATS. */
export function normaliseCV(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\t/g, '  ')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

export function validateReviewInput(input: ReviewInput): void {
  const text = input.cvText.trim();
  if (text.length < MIN_CV_CHARS)
    throw new Error(
      'Please add your CV first (at least 80 characters). Your sample is never used automatically.',
    );
  if (text.length > MAX_CV_CHARS)
    throw new Error('Your CV is too long for this review. Please keep it under 30,000 characters.');
  if (input.targetRole.length > MAX_ROLE_CHARS)
    throw new Error('Please keep the target role under 150 characters.');
  if (input.jobDescription.length > MAX_JOB_CHARS)
    throw new Error('Please keep the job description under 12,000 characters.');
  const controls = (text.match(/[\x00-\x08\x0b\x0c\x0e-\x1f\ufffd]/g) || []).length;
  if (/^PK\x03\x04|^%PDF/.test(text) || controls > Math.max(3, text.length * 0.01)) {
    throw new Error(
      'This looks like document data, not readable CV text. Upload a PDF or DOCX, or paste the text instead.',
    );
  }
  if ((text.match(/[\p{L}\p{N}]/gu) || []).length < 40)
    throw new Error('Please provide readable CV text, including your experience or education.');
}

type SectionKind = 'experience' | 'education' | 'skills' | 'summary' | 'other';
export function headingKind(line: string): SectionKind | null {
  const value = line
    .trim()
    .replace(/[:—–-]+$/, '')
    .trim();
  if (value.length > 65 || /^[•*\-]\s/.test(value)) return null;
  if (
    /^(?:(?:work|professional|relevant|employment|volunteer|volunteering|career|internship)\s+)?experience(?:\s*[&/]\s*projects)?$|^employment history$|^work history$|^(?:personal |selected |academic )?projects$|^volunteering$/i.test(
      value,
    )
  )
    return 'experience';
  if (
    /^(?:education|qualifications|academic background|certifications|training)(?:\s*[&/]\s*(?:education|qualifications|certifications|training))?$/i.test(
      value,
    )
  )
    return 'education';
  if (
    /^(?:(?:technical|core|key|professional|hard|soft)\s+)?(?:skills|competencies)(?:\s*[&/]\s*(?:tools|skills|competencies))?$|^tools$/i.test(
      value,
    )
  )
    return 'skills';
  if (
    /^(?:professional |career |personal |executive )?(?:summary|profile|objective|statement)$|^about me$/i.test(
      value,
    )
  )
    return 'summary';
  if (
    /^(?:references|interests|hobbies|languages|awards|publications|achievements|contact(?: details)?)$/i.test(
      value,
    )
  )
    return 'other';
  return null;
}
export function isSectionHeading(line: string): boolean {
  return headingKind(line) !== null;
}

const gerunds: Record<string, string> = {
  managing: 'Managed',
  handling: 'Handled',
  providing: 'Provided',
  developing: 'Developed',
  maintaining: 'Maintained',
  resolving: 'Resolved',
  supporting: 'Supported',
  coordinating: 'Coordinated',
  preparing: 'Prepared',
  writing: 'Wrote',
  creating: 'Created',
  designing: 'Designed',
  processing: 'Processed',
  reconciling: 'Reconciled',
  organising: 'Organised',
  organizing: 'Organized',
  assisting: 'Assisted',
  teaching: 'Taught',
  tracking: 'Tracked',
  recording: 'Recorded',
  addressing: 'Addressed',
  communicating: 'Communicated',
  answering: 'Answered',
  editing: 'Edited',
  testing: 'Tested',
  analysing: 'Analysed',
  analyzing: 'Analyzed',
  reporting: 'Reported',
  monitoring: 'Monitored',
  operating: 'Operated',
  collecting: 'Collected',
};

/** Only conservative grammatical edits. No facts, numbers, tools, seniority or outcomes are generated. */
export function improveBullet(original: string): string {
  let value = original.trim().replace(/\s{2,}/g, ' ');
  const match = value.match(/^(?:I (?:was|am) |Was |Is )?responsible for\s+(.+)$/i);
  if (match) {
    const rest = match[1];
    const word = rest.split(/\s/)[0].toLowerCase();
    if (gerunds[word]) {
      value = gerunds[word] + rest.slice(word.length);
      value = value.replace(/\band\s+(\w+ing)\b/gi, (all, verb: string) =>
        gerunds[verb.toLowerCase()] ? `and ${gerunds[verb.toLowerCase()].toLowerCase()}` : all,
      );
    } else if (/^(?:daily )?customer service and addressing customer complaints\.?$/i.test(rest)) {
      value = `Provided ${rest.replace(/addressing/i, 'addressed')}`;
    }
    // Other noun phrases stay intact: guessing a verb could change a responsibility into a false achievement.
  }
  if (value) value = value[0].toUpperCase() + value.slice(1);
  return value;
}

interface ExperienceItem {
  lineIndex: number;
  text: string;
  marker: string;
}
export function experienceItems(lines: string[]): ExperienceItem[] {
  let section: SectionKind | null = null;
  const hasExperienceHeading = lines.some((line) => headingKind(line) === 'experience');
  const items: ExperienceItem[] = [];
  for (const [lineIndex, line] of lines.entries()) {
    const heading = headingKind(line);
    if (heading) {
      section = heading;
      continue;
    }
    if (hasExperienceHeading && section !== 'experience') continue;
    if (!hasExperienceHeading && section && section !== 'experience') continue;
    const trimmed = line.trim();
    const bullet = trimmed.match(/^([•*\-]\s+|\d{1,2}[.)]\s+)(.+)$/);
    const body = bullet ? bullet[2] : trimmed;
    const action =
      /^(?:responsible for|(?:I (?:was|am) |Was )?responsible for|managed|handled|led|developed|created|provided|resolved|supported|coordinated|prepared|wrote|designed|processed|reconciled|organised|organized|assisted|taught|tracked|recorded|addressed|communicated|answered|edited|tested|analysed|analyzed|reported|maintained|operated|attended|counted|participated|served|helped|built|implemented|delivered|worked|conducted)\b/i.test(
        body,
      );
    if (
      (bullet || action) &&
      body.length > 14 &&
      !/^(?:HND|OND|B\.?Sc|B\.?A\b|M\.?Sc|higher national diploma|certificate|university|national youth service corps)\b/i.test(
        body,
      )
    ) {
      items.push({ lineIndex, text: body, marker: bullet ? bullet[1] : '' });
    }
  }
  return items;
}

const families = [
  {
    label: 'Customer support',
    pattern:
      /\bcustomer (?:support|service|success)\b|\bclient (?:support|service)\b|\bhelp\s?desk\b|\bsupport officer\b|\bcx\b/i,
    skills: [
      'Customer service',
      'Customer communication',
      'Complaint resolution',
      'Ticketing',
      'CRM',
      'Microsoft Excel',
      'Zendesk',
      'Escalation',
    ],
  },
  {
    label: 'Data and analytics',
    pattern:
      /\bdata (?:analyst|analytics|engineer|scientist|annotation)\b|\bbusiness intelligence\b|\bmachine learning\b/i,
    skills: [
      'SQL',
      'Microsoft Excel',
      'Data analysis',
      'Python',
      'Power BI',
      'Tableau',
      'Data visualisation',
    ],
  },
  {
    label: 'Software development',
    pattern:
      /\b(?:software|developer|frontend|backend|full[- ]?stack|programmer|devops)\b|\bweb development\b/i,
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Python',
      'Git',
      'REST APIs',
      'Unit testing',
      'CI/CD',
    ],
  },
  {
    label: 'Administration and operations',
    pattern:
      /\b(?:virtual|executive|administrative) assistant\b|\boffice administrator\b|\boperations (?:officer|manager|assistant)\b/i,
    skills: [
      'Calendar management',
      'Scheduling',
      'Microsoft Excel',
      'Record keeping',
      'Email management',
      'Google Workspace',
      'Project coordination',
    ],
  },
  {
    label: 'Writing and editorial',
    pattern: /\b(?:writer|copywriter|editor|journalist|content strategist)\b/i,
    skills: [
      'Editing',
      'Copywriting',
      'Research',
      'SEO',
      'WordPress',
      'Content strategy',
      'Proofreading',
    ],
  },
  {
    label: 'Sales and marketing',
    pattern: /\b(?:sales|marketing|account executive)\b/i,
    skills: [
      'CRM',
      'Lead generation',
      'Customer communication',
      'Account management',
      'Email marketing',
      'Sales reporting',
    ],
  },
];
const allSkills = [...new Set(families.flatMap((family) => family.skills))];
const aliases: Record<string, string[]> = {
  'Microsoft Excel': ['Microsoft Excel', 'Excel'],
  'Customer service': ['customer service', 'customer support'],
  'REST APIs': ['REST APIs', 'RESTful APIs', 'REST API'],
  'Data visualisation': ['data visualisation', 'data visualization'],
  'CI/CD': ['CI/CD', 'continuous integration'],
  'Unit testing': ['unit testing', 'unit tests'],
  'Record keeping': ['record keeping', 'recordkeeping'],
};
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function containsSkill(text: string, skill: string): boolean {
  return (aliases[skill] || [skill]).some((term) =>
    new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegex(term)}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(text),
  );
}
function getName(lines: string[]): string {
  const first =
    lines
      .find((line) => line.trim() && !/^(?:curriculum vitae|resume|résumé|cv)$/i.test(line.trim()))
      ?.trim() || '';
  return !headingKind(first) && first.length < 90 && !/@|https?:\/\/|\d{3}/.test(first)
    ? first
    : '';
}
function roleContext(lines: string[], targetRole: string): string {
  if (targetRole.trim()) return targetRole.trim();
  const start = lines.findIndex((line) => headingKind(line) === 'experience');
  if (start >= 0) {
    const title = lines
      .slice(start + 1)
      .find((line) => line.trim() && !isSectionHeading(line) && !/^[•*\-\d]/.test(line.trim()));
    if (title) return title.split(/\s[—–|]\s/)[0].trim();
  }
  return lines
    .filter(
      (line) =>
        !headingKind(line) && !/university|college|polytechnic|diploma|education/i.test(line),
    )
    .slice(0, 8)
    .join(' ');
}
function hasEvidence(text: string): boolean {
  return (
    /(?:\d[\d,.]*\s*(?:%|customers?|clients?|students?|users?|tickets?|projects?|hours?|minutes?|days?|weekly|daily|monthly|reports?|transactions?|people|team members)|[₦$£€]\s*\d)/i.test(
      text,
    ) || /\b(?:using|via|through|for|with)\s+\S.{5,}/i.test(text)
  );
}
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function reviewCV(raw: ReviewInput): ReviewResult {
  validateReviewInput(raw);
  const input = {
    ...raw,
    cvText: normaliseCV(raw.cvText),
    targetRole: raw.targetRole.trim(),
    jobDescription: raw.jobDescription.trim(),
  };
  const lines = input.cvText.split('\n');
  const items = experienceItems(lines);
  const name = getName(lines);
  const sections = new Set(lines.map(headingKind).filter(Boolean));
  const email = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(input.cvText);
  const phone = /(?:\+?\d[\d ()-]{8,}\d)/.test(lines.slice(0, 8).join('\n'));
  const context = roleContext(lines, input.targetRole);
  const family = families.find((candidate) => candidate.pattern.test(context));
  const role =
    input.targetRole ||
    (context.length < 110 ? context : '') ||
    family?.label ||
    'General CV review';
  const candidates = input.jobDescription
    ? allSkills.filter((skill) => containsSkill(input.jobDescription, skill))
    : family?.skills || [];
  const keywordMatches = candidates.filter((skill) => containsSkill(input.cvText, skill));
  const keywordGaps = candidates.filter((skill) => !containsSkill(input.cvText, skill));
  const weak = items.filter((item) =>
    /^(?:(?:I (?:was|am)|Was) )?responsible for/i.test(item.text),
  );
  const vague = (
    input.cvText.match(
      /\b(?:hardworking|hard-working|results-driven|team player|go-getter|dynamic individual|highly motivated)\b/gi,
    ) || []
  ).length;
  const long = items.filter((item) => item.text.split(/\s+/).length > 40).length;
  const evidenceCount = items.filter((item) => hasEvidence(item.text)).length;
  const structure =
    ['experience', 'education', 'skills', 'summary'].filter((key) =>
      sections.has(key as SectionKind),
    ).length * 25;
  const clarity = items.length
    ? clamp(
        100 -
          (weak.length / items.length) * 60 -
          Math.min(20, vague * 5) -
          (long / items.length) * 20,
      )
    : 40;
  const evidence = items.length ? clamp(35 + (evidenceCount / items.length) * 65) : 20;
  const details =
    [Boolean(name), email, phone, sections.has('education')].filter(Boolean).length * 25;
  const hasKeywordAssessment = Boolean(input.jobDescription && candidates.length);
  const alignment = hasKeywordAssessment
    ? clamp((keywordMatches.length / candidates.length) * 100)
    : details;
  const pillars = [
    {
      id: 'structure',
      label: 'Clear structure',
      score: structure,
      explanation:
        '25 points each for recognisable summary, experience/projects, education/certifications, and skills headings. Document layout itself is not inspected.',
    },
    {
      id: 'clarity',
      label: 'Clear wording',
      score: clarity,
      explanation:
        'Starts at 100 for experience bullets, with proportional deductions for responsibility-led or very long bullets, and up to 20 points for generic phrases. No identifiable bullets scores 40.',
    },
    {
      id: 'evidence',
      label: 'Specific detail',
      score: evidence,
      explanation:
        '35 base points plus up to 65 for bullets mentioning supplied quantities, tools, methods, or scope. Dates and degrees are not treated as achievements. No identifiable bullets scores 20.',
    },
    {
      id: 'alignment',
      label: hasKeywordAssessment ? 'Job keywords' : 'Core details',
      score: alignment,
      explanation: hasKeywordAssessment
        ? `Share of ${candidates.length} recognised skill terms from your job description that also appear in your CV. This is a limited vocabulary check, not a hiring probability.`
        : '25 points each for an identifiable name, email, phone, and education/certifications heading. Job keyword scoring requires a job description with recognised skill terms.',
    },
  ];
  const score = clamp(pillars.reduce((total, pillar) => total + pillar.score, 0) / pillars.length);
  const changes = items
    .map((item) => ({
      lineIndex: item.lineIndex,
      original: item.text,
      revised: improveBullet(item.text),
      reason: 'Replaced responsibility-led wording with a clearer action, without adding facts.',
    }))
    .filter((change) => change.original !== change.revised);
  const sampleRewrite = changes[0] || null;
  const strengths: string[] = [];
  if (sections.has('experience'))
    strengths.push('Your experience or projects have a recognisable heading.');
  if (email && phone) strengths.push('Your email and phone number are easy to find in the text.');
  if (sections.has('education'))
    strengths.push('Your education or qualifications are clearly separated.');
  if (evidenceCount)
    strengths.push(
      `${evidenceCount} experience ${evidenceCount === 1 ? 'bullet includes' : 'bullets include'} specific scope, methods, tools, or supplied quantities.`,
    );
  if (/\bNYSC\b|national youth service corps/i.test(input.cvText))
    strengths.push(
      'Your NYSC experience can stay under its truthful title, with duties explained clearly.',
    );
  if (!strengths.length)
    strengths.push('You have readable CV content to build on. Review the priorities below.');
  const suggestions: ReviewResult['suggestions'] = [];
  if (!email || !phone || !name)
    suggestions.push({
      id: 'contact',
      title: 'Check your contact details',
      description: `Make sure your name, email, and reachable phone number are visible at the top.${!name ? ' We could not confidently identify a name in the first line.' : ''}`,
      priority: 'high',
    });
  const missingSections = ['experience', 'education', 'skills'].filter(
    (key) => !sections.has(key as SectionKind),
  );
  if (missingSections.length)
    suggestions.push({
      id: 'structure',
      title: 'Give each section a clear heading',
      description: `We did not recognise: ${missingSections.join(', ')}. Use familiar headings such as Work Experience, Education, and Skills. Projects or volunteering can stand in for paid work.`,
      priority: 'high',
    });
  if (sampleRewrite)
    suggestions.push({
      id: 'wording',
      title: 'Let the action lead',
      description:
        'A direct verb makes the responsibility easier to understand. The suggestion below changes the wording, not your achievements.',
      excerpt: sampleRewrite.original,
      revision: sampleRewrite.revised,
      priority: 'medium',
    });
  if (items.length && evidenceCount / items.length < 0.6)
    suggestions.push({
      id: 'detail',
      title: 'Add detail you can verify',
      description:
        'Where useful, explain who you helped, which tools you used, or the scope of the work. Only add numbers or outcomes you can stand behind; a clear example can be useful without a percentage.',
      excerpt: items.find((item) => !hasEvidence(item.text))?.text,
      priority: 'medium',
    });
  if (vague)
    suggestions.push({
      id: 'generic',
      title: 'Swap generic claims for examples',
      description:
        'Phrases such as “hardworking” or “results-driven” are stronger when supported by a specific example already in your experience.',
      priority: 'low',
    });
  if (long)
    suggestions.push({
      id: 'length',
      title: 'Split your longest bullets',
      description:
        'Some bullets exceed 40 words. Separate distinct responsibilities while keeping the context and all important facts.',
      priority: 'low',
    });
  if (input.jobDescription && keywordGaps.length)
    suggestions.push({
      id: 'keywords',
      title: 'Check the job’s skill requirements',
      description:
        'Some recognised terms from the job description are not in your CV. Mention them only if you genuinely have that experience; otherwise, treat them as learning goals.',
      priority: 'medium',
    });
  if (input.jobDescription && !candidates.length)
    suggestions.push({
      id: 'unrecognised-jd',
      title: 'Compare the job description yourself too',
      description:
        'This job description did not contain skill terms in our current vocabulary. No keyword-match score was calculated. Review its responsibilities and requirements manually.',
      priority: 'low',
    });
  const followUpQuestions =
    family?.label === 'Customer support'
      ? [
          'What kinds of customer enquiries or payment issues did you handle?',
          'Can you verify the typical number of enquiries, channels, or resolution times?',
        ]
      : [
          'Which tools or methods did you actually use in your most relevant role?',
          'What outcome or scope of work can you describe accurately, with or without numbers?',
        ];
  return {
    score,
    scoreLabel:
      score >= 75
        ? 'A good foundation'
        : score >= 50
          ? 'Room to strengthen'
          : 'Let’s make it clearer',
    candidateName: name,
    targetRole: role,
    wordCount: input.cvText.split(/\s+/).length,
    pillars,
    strengths: strengths.slice(0, 4),
    suggestions,
    keywordMatches,
    keywordGaps,
    keywordSource: input.jobDescription ? 'job-description' : family ? 'role-ideas' : 'none',
    sampleRewrite,
    followUpQuestions,
    method: 'rules-v2',
  };
}
