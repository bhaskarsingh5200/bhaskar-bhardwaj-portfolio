import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center" role="alert">
          <span className="eyebrow">Something went wrong</span>
          <h1 className="mb-4 font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em]">
            An unexpected error occurred.
          </h1>
          <p className="mb-10 max-w-[46ch] text-ink-secondary">
            Please refresh the page or return to the homepage to continue.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-[7px] bg-accent px-7 py-3.5 font-heading text-[0.95rem] font-semibold text-white shadow-[0_10px_28px_-12px_rgb(var(--accent)_/_0.6),inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors duration-300 hover:bg-accent-hover"
          >
            Back to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
