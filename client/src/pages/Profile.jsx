import { useState } from 'react';
import toast from 'react-hot-toast';
import { userAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import { getInitials } from '../utils/helpers';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ name: form.name });
      updateUser(res.data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-primary-100 px-3 py-0.5 text-xs font-medium capitalize text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-gray-50 dark:bg-gray-900" value={user?.email} disabled />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
