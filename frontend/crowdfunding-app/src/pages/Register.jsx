import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, metaAPI } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userTypeId: '',
  });
  const [userTypes, setUserTypes] = useState([]);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    special: false,
    digit: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();

  // Password validation regex patterns
  const passwordValidation = {
    length: /^.{8,}$/, // At least 8 characters
    uppercase: /[A-Z]/, // At least one uppercase letter
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, // Special character
    digit: /\d/, // At least one digit
  };

  const validatePassword = (password) => {
    const errors = {
      length: !passwordValidation.length.test(password),
      uppercase: !passwordValidation.uppercase.test(password),
      special: !passwordValidation.special.test(password),
      digit: !passwordValidation.digit.test(password),
    };
    setPasswordErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await metaAPI.getUserTypes();
        // Filter out ADMIN role from registration
        const filteredTypes = response.data.filter(type => type.typeName !== 'ADMIN');
        setUserTypes(filteredTypes);
        if (filteredTypes.length > 0) {
          setFormData(prev => ({ ...prev, userTypeId: filteredTypes[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch user types', err);
      }
    };
    fetchUserTypes();
  }, []);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    if (password.length > 0) {
      validatePassword(password);
    } else {
      setPasswordErrors({ length: false, uppercase: false, special: false, digit: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password before submission
    if (!validatePassword(formData.password)) {
      setError('Password does not meet all requirements. Please check the requirements below.');
      return;
    }

    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const isPasswordValid = !Object.values(passwordErrors).some(error => error);

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <h1>Register</h1>
      {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handlePasswordChange}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => {
              if (formData.password === '') {
                setShowPasswordRequirements(false);
              }
            }}
            required
            style={{ 
              padding: '10px', 
              border: formData.password && isPasswordValid ? '2px solid #28a745' : formData.password ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          
          {/* Password Requirements Display */}
          {showPasswordRequirements && formData.password && (
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333' }}>Password Requirements:</p>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.9rem' }}>
                <li style={{ 
                  color: passwordErrors.length ? '#dc3545' : '#28a745',
                  textDecoration: passwordErrors.length ? 'none' : 'line-through',
                  marginBottom: '5px'
                }}>
                  {passwordErrors.length ? '❌' : '✓'} At least 8 characters
                </li>
                <li style={{ 
                  color: passwordErrors.uppercase ? '#dc3545' : '#28a745',
                  textDecoration: passwordErrors.uppercase ? 'none' : 'line-through',
                  marginBottom: '5px'
                }}>
                  {passwordErrors.uppercase ? '❌' : '✓'} At least one uppercase letter (A-Z)
                </li>
                <li style={{ 
                  color: passwordErrors.digit ? '#dc3545' : '#28a745',
                  textDecoration: passwordErrors.digit ? 'none' : 'line-through',
                  marginBottom: '5px'
                }}>
                  {passwordErrors.digit ? '❌' : '✓'} At least one digit (0-9)
                </li>
                <li style={{ 
                  color: passwordErrors.special ? '#dc3545' : '#28a745',
                  textDecoration: passwordErrors.special ? 'none' : 'line-through'
                }}>
                  {passwordErrors.special ? '❌' : '✓'} At least one special character (!@#$%^&* etc.)
                </li>
              </ul>
            </div>
          )}
        </div>

        <select
          value={formData.userTypeId}
          onChange={(e) => setFormData({ ...formData, userTypeId: e.target.value })}
          required
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="" disabled>Select User Type</option>
          {userTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.typeName}
            </option>
          ))}
        </select>

        <button 
          type="submit" 
          disabled={!isPasswordValid && formData.password !== ''}
          style={{ 
            padding: '10px', 
            backgroundColor: !isPasswordValid && formData.password !== '' ? '#cccccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: !isPasswordValid && formData.password !== '' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Register
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
}
