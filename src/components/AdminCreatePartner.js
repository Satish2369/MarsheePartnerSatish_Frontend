"use client"

import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constant';

 export function AdminCreatePartner() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post( BASE_URL+'/admin/invite-partner', {
        name,
        email,
        role,
      },{
        withCredentials:true
      });
      setMessage('Invitation email sent successfully! ');

     
      setName('');
      setEmail('');
      setRole('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to send invitation ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border border-black shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Create partner Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full border text-black px-3 py-2 rounded cursor-pointer"
        >
          <option value="">Select Role</option>
          <option value="manager">manager</option>
          <option value="partner">Partner</option>
          <option value="admin">admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Invite'}
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}


