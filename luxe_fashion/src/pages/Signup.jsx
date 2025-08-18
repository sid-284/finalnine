import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../pages/homepage/components/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { auth, provider } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { apiFetch } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      // Firebase signup
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Send to backend
      await apiFetch('/auth/registration', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          firebaseUid: user.uid,
          name: user.displayName || '',
          avatar: user.photoURL || '',
        }),
      });
      
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (err.message.includes('weak-password')) {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.message.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Send to backend
      await apiFetch('/auth/registration', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          name: user.displayName || '',
          avatar: user.photoURL || '',
        }),
      });
      
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.message.includes('popup-closed-by-user')) {
        setError('Signup was cancelled. Please try again.');
      } else if (err.message.includes('account-exists-with-different-credential')) {
        setError('An account with this email already exists with a different sign-in method.');
      } else {
        setError(err.message || 'Google signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 text-center">Create your Luxe account</h2>
          <form className="space-y-5" onSubmit={handleSignup}>
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
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            {error && <div className="text-error text-sm text-center">{error}</div>}
            {success && <div className="text-success text-sm text-center">{success}</div>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Sign Up
            </Button>
          </form>
          <div className="my-4 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">or</span>
          </div>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleGoogleSignup}
            loading={loading}
            iconName="Google"
          >
            Sign up with Google
          </Button>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <button className="text-accent hover:underline" onClick={() => navigate('/login')}>
              Log in
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup; 