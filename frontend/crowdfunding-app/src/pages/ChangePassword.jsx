import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';
import { authAPI, userAPI } from '../services/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordValidation = {
    length: /^.{8,}$/,
    uppercase: /[A-Z]/,
    special: /[^A-Za-z0-9]/,
    digit: /\d/,
  };

  const passwordErrors = {
    length: !passwordValidation.length.test(formData.newPassword),
    uppercase: !passwordValidation.uppercase.test(formData.newPassword),
    special: !passwordValidation.special.test(formData.newPassword),
    digit: !passwordValidation.digit.test(formData.newPassword),
  };

  const isPasswordValid = !Object.values(passwordErrors).some(Boolean);
  const passwordsMatch = formData.newPassword === formData.confirmPassword;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (e) => {
    setFormData((current) => ({ ...current, [field]: e.target.value }));
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('New password does not meet all requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await userAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessage('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell auth-shell">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>

      <h1 className="page-title">Change Password</h1>
      <p className="page-subtitle">Signed in as {user.email}</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit} className="surface form-card form-grid" style={{ marginTop: '20px' }}>
        <PasswordField
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={handleChange('currentPassword')}
          required
        />

        <PasswordField
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange('newPassword')}
          required
        />

        <PasswordField
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
        />

        {formData.newPassword && (
          <div className="password-requirements">
            <p>Password Requirements:</p>
            <ul>
              <li className={passwordErrors.length ? 'invalid' : 'valid'}>At least 8 characters</li>
              <li className={passwordErrors.uppercase ? 'invalid' : 'valid'}>At least one uppercase letter</li>
              <li className={passwordErrors.digit ? 'invalid' : 'valid'}>At least one digit</li>
              <li className={passwordErrors.special ? 'invalid' : 'valid'}>At least one special character</li>
              {formData.confirmPassword && (
                <li className={passwordsMatch ? 'valid' : 'invalid'}>Passwords match</li>
              )}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !formData.currentPassword || !isPasswordValid || !passwordsMatch}
          className="btn btn-primary"
        >
          {submitting ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
