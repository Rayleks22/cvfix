import { isSectionHeading } from '../lib/review.ts';
export function DocumentPreview({
  text,
  coverLetter = false,
}: {
  text: string;
  coverLetter?: boolean;
}) {
  let first = true;
  return (
    <div
      className={`document-sheet ${coverLetter ? 'letter-sheet' : ''}`}
      data-testid="document-preview"
    >
      {text
        .replace(/\r/g, '')
        .split('\n')
        .map((line, index) => {
          if (!line.trim()) return <div className="document-space" key={index} />;
          const name = first && !coverLetter;
          first = false;
          const heading = isSectionHeading(line);
          return name ? (
            <h2 className="document-name" key={index}>
              {line}
            </h2>
          ) : heading ? (
            <h3 className="document-heading" key={index}>
              {line}
            </h3>
          ) : (
            <p className={/^[•*\-]\s/.test(line) ? 'document-bullet' : 'document-line'} key={index}>
              {line}
            </p>
          );
        })}
    </div>
  );
}
