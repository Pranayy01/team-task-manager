import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { taskAPI, projectAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import TaskCard from '../components/tasks/TaskCard';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TaskSkeleton } from '../components/ui/Skeleton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Tasks() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', project: '', sort: '-createdAt' });
  const [editModal, setEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.search === '') delete params.search;
      if (params.status === '') delete params.status;
      if (params.priority === '') delete params.priority;
      if (params.project === '') delete params.project;
      const res = await taskAPI.getAll(params);
      setTasks(res.data.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    projectAPI.getAll().then((r) => setProjects(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      fetchTasks();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const openEdit = (task) => {
    setEditingTask({ ...task, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    setEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.update(editingTask._id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || undefined,
        status: editingTask.status,
        assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || undefined,
      });
      toast.success('Task updated');
      setEditModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="input lg:col-span-2"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="input" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="-createdAt">Newest</option>
            <option value="dueDate">Due Date (Asc)</option>
            <option value="-dueDate">Due Date (Desc)</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
        <div className="mt-3">
          <select className="input max-w-xs" value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })}>
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}</div>
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Try adjusting your filters or create tasks in a project" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="relative group">
              <TaskCard task={task} canEdit onStatusChange={handleStatusChange} />
              {user?.role === 'admin' && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(task)} className="text-xs text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Task" size="lg">
        {editingTask && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input className="input" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={editingTask.description || ''} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Priority</label>
                <select className="input" value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" className="input" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Save Changes</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
