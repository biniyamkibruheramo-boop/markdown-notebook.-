import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Parse Firebase error messages into user-friendly text
  const formatAuthError = (err) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was closed before completion.';
      default:
        return err.message || 'An error occurred during authentication.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'reset') {
      try {
        setIsSubmitting(true);
        await resetPassword(email.trim());
        setSuccessMsg('Password reset email sent! Check your inbox.');
      } catch (err) {
        setError(formatAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (mode === 'signup') {
        await signup(email.trim(), password, displayName.trim());
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = (newMode) => {
    setError('');
    setSuccessMsg('');
    setMode(newMode);
  };

  return (
    <div className="auth-viewport">
      {/* Notebook binding accent banner on top */}
      <div className="auth-card-wrapper">
        <div className="auth-card">
          {/* Notebook Spiral Accent Holes */}
          <div className="notebook-holes" aria-hidden="true">
            <span className="hole"></span>
            <span className="hole"></span>
            <span className="hole"></span>
            <span className="hole"></span>
            <span className="hole"></span>
          </div>

          {/* Header */}
          <div className="auth-header">
            <div className="auth-brand-badge">
              <div className="auth-brand-icon">
                <BookOpen size={20} />
              </div>
              <span className="auth-brand-name">Notes App</span>
            </div>

            <h1 className="auth-title">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h1>
            <p className="auth-subtitle">
              {mode === 'signin' && 'Sign in to access your personal notebook.'}
              {mode === 'signup' && 'Create your account to start capturing your ideas.'}
              {mode === 'reset' && 'Enter your email to receive password reset instructions.'}
            </p>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="auth-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="displayName">
                  Full Name
                </label>
                <div className="auth-input-group">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="displayName"
                    type="text"
                    className="auth-input"
                    placeholder="Jane Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email Address
              </label>
              <div className="auth-input-group">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => toggleMode('reset')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    className="auth-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting || isGoogleLoading}
            >
              {isSubmitting ? (
                <div className="auth-spinner"></div>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Reset Link'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Sign-In (Only shown in signin and signup modes) */}
          {mode !== 'reset' && (
            <>
              <div className="auth-divider">
                <span className="divider-line"></span>
                <span className="divider-text">or continue with</span>
                <span className="divider-line"></span>
              </div>

              <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="auth-spinner dark"></div>
                ) : (
                  <>
                    <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Mode Switcher / Links at bottom */}
          <div className="auth-footer">
            {mode === 'signin' && (
              <p className="auth-footer-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => toggleMode('signup')}
                >
                  Create Account
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="auth-footer-text">
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => toggleMode('signin')}
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="auth-footer-text">
                Remember your password?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => toggleMode('signin')}
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
