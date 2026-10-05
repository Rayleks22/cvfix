import { LoaderCircle } from 'lucide-react';
export function AnalysisLoader() {
  return (
    <div className="container loading-state" role="status">
      <LoaderCircle size={30} className="spin" />
      <h2>Checking your CV’s text…</h2>
      <p>Reviewing headings, wording and supplied details in your browser.</p>
    </div>
  );
}
