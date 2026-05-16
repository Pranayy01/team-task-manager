import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { projectAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((s) => s.user);
  const canCreate = user?.role === 'admin';

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectAPI.create(form);
      toast.success('Project created');
      setModalOpen(false);
      setForm({ title: '', description: '' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">{projects.length} project(s)</p>
        {canCreate && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            + New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={canCreate ? 'Create your first project to get started' : 'You have not been added to any projects yet'}
          action={canCreate && <button onClick={() => setModalOpen(true)} className="btn-primary">Create Project</button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="card hover:shadow-md transition-shadow group">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{p.description || 'No description'}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{p.teamMembers?.length || 0} members</span>
                <span>{p.completedCount || 0}/{p.taskCount || 0} tasks done</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-1.5 rounded-full bg-primary-600"
                  style={{ width: `${p.taskCount ? (p.completedCount / p.taskCount) * 100 : 0}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <LoadingSpinner size="sm" /> : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
