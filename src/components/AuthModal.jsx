import { useEffect } from 'react';

function AuthModal({ open, onClose, onGoogle, busy }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <h3 className="auth-modal-title" id="auth-modal-title">Sign in</h3>
          <button className="auth-modal-close" onClick={onClose} aria-label="Close sign in">
            X
          </button>
        </div>
        <div className="auth-modal-body">
          <p className="auth-modal-subtitle">Save your progress and keep your streak.</p>
          <button
            className="auth-provider-btn google"
            onClick={onGoogle}
            disabled={busy}
          >
            <span className="auth-provider-icon">G</span>
            Continue with Google
          </button>
          <p className="auth-legal">By continuing, you agree to our Terms and Privacy.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
