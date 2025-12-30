import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.phone) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.phone);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="auth-page">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {isLogin ? 'Login' : 'Create Account'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#CCFF00] flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-extrabold text-[#2D0036]">F</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2D0036]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Welcome to Nimzo
          </h2>
          <p className="text-gray-500 mt-2">Groceries delivered in 10-15 minutes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1.5"
                  data-testid="name-input"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1.5"
                  data-testid="phone-input"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1.5"
              data-testid="email-input"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg" data-testid="auth-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#CCFF00] text-[#2D0036] hover:bg-[#B3E600] font-bold py-6 rounded-full"
            data-testid="submit-btn"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-6 text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-2 text-[#2D0036] font-semibold hover:underline"
            data-testid="toggle-auth-mode"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm">
          <p className="font-medium text-gray-700 mb-2">Demo Admin Credentials:</p>
          <p className="text-gray-500">Email: admin@flashmart.com</p>
          <p className="text-gray-500">Password: admin123</p>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
