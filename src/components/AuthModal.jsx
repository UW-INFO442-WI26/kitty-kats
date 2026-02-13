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
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={onClose} 
      role="presentation"
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ maxWidth: '400px', width: '90%' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0 fw-bold text-deep-plum" id="auth-modal-title">Sign in</h3>
          <button className="btn-close" onClick={onClose} aria-label="Close sign in"></button>
        </div>
        <div className="text-center">
          <p className="text-muted mb-4">Save your progress and keep your streak.</p>
          <button
            className="btn btn-outline-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill"
            onClick={onGoogle}
            disabled={busy}
          >
            <span className="fw-bold text-danger">G</span>
            Continue with Google
          </button>
          <p className="text-muted small mt-4">By continuing, you agree to our Terms and Privacy.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
