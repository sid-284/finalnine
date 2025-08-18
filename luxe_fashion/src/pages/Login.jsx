import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../pages/homepage/components/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { auth, provider } from '../utils/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { apiFetch } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Send to backend
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: form.email, 
          firebaseUid: user.uid,
          name: user.displayName || '',
          avatar: user.photoURL || '',
        }),
      });
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/homepage'), 1200);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Send to backend
      await apiFetch('/auth/googlelogin', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          name: user.displayName || '',
          avatar: user.photoURL || '',
        }),
      });
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/homepage'), 1200);
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 text-center">Sign in to 9tytwo</h2>
          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            {error && <div className="text-error text-sm text-center">{error}</div>}
            {success && <div className="text-success text-sm text-center">{success}</div>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Log In
            </Button>
          </form>
          <div className="my-4 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">or</span>
          </div>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleGoogleLogin}
            loading={loading}
            iconName="Google"
          >
            Sign in with Google
          </Button>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <button className="text-accent hover:underline" onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login; 
