import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* Do not log CV content or component props. */
  }
  render() {
    return this.state.failed ? (
      <main className="container payment-recovery">
        <h1>Something didn’t load</h1>
        <p>
          Please reload the page. If you have paid, keep your payment reference and don’t pay again.
          Your encrypted checkout session may still be recoverable in this tab.
        </p>
        <button className="button button-primary" onClick={() => window.location.reload()}>
          Reload CVFix
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
