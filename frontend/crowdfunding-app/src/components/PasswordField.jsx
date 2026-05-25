import { useState } from 'react';

export default function PasswordField({
  value,
  onChange,
  placeholder = 'Password',
  inputStyle,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-field">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword((current) => !current)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
