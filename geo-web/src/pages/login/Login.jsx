import { toast } from 'sonner';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import api from '../../api/axios.js';
import { useNavigate } from 'react-router';
import InputGroup from '../../components/ui/InputGroup.jsx';

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await api.post('/api/login', formData);
      const data = res.data;

      console.log(data);

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/home');
      toast.success(data.message || 'Login successfully');
    } catch (err) {
      const res = err.response;
      const error = res.data.errors;
      setLoginError(
        error.email?.[0] || error.password?.[0] || 'Invalid credentials'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4'>
            <Globe className='w-8 h-8 text-indigo-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome Back</h1>
          <p className='text-gray-600 mt-2'>Sign in to access IP Geolocation</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputGroup
            type={'email'}
            name={'email'}
            label={'Email Address'}
            value={formData.email}
            placeholder={'test@example.com'}
            handleInputChange={handleInputChange}
            required
          />

          <InputGroup
            type={'password'}
            name={'password'}
            label={'Password'}
            value={formData.password}
            placeholder={'••••••••'}
            handleInputChange={handleInputChange}
            required
          />

          {loginError && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
              {loginError}
            </div>
          )}

          <button
            type='submit'
            disabled={loginLoading}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loginLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
