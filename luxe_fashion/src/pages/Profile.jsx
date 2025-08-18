import React, { useState } from 'react';
import Header from '../components/ui/Header';
import Footer from './homepage/components/Footer';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Profile = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await apiFetch('/user/updateprofile', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.name,
          photoURL: form.avatar,
        });
      }
      setSuccess('Profile updated!');
    } catch (err) {
      setError('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          {user && (
            <>
              {form.avatar ? (
                <img src={form.avatar} alt="User avatar" className="w-20 h-20 rounded-full object-cover border border-border mx-auto mb-4" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-3xl border border-border mx-auto mb-4">
                  {form.email ? form.email[0].toUpperCase() : '?'}
                </div>
              )}
              <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                {error && <div className="text-error text-sm text-center">{error}</div>}
                {success && <div className="text-success text-sm text-center">{success}</div>}
                <Button type="submit" variant="primary" fullWidth loading={loading}>
                  Update Profile
                </Button>
              </form>
            </>
          )}
          <div className="flex flex-col gap-3 mt-6">
            <Button variant="outline" onClick={() => signOut(auth)}>
              Log out
            </Button>
            <Button variant="primary" asChild>
              <Link to="/collection-universe">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 
