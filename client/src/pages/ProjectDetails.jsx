import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { projectAPI, taskAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import Modal from '../components/ui/Modal';
import TaskCard from '../components/tasks/TaskCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getInitials } from '../utils/helpers';

export default function ProjectDetails() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberModal, setMemberModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', status: 'todo',
  });

  const project = data?.project;
  const userId = user?._id?.toString();
  const isProjectAdmin =
    project?.teamMembers?.some(
      (m) => m.user._id?.toString() === userId && m.role === 'admin'
    ) ||
    project?.createdBy?._id?.toString() === userId ||
    project?.createdBy?.toString() === userId ||
    user?.role === 'admin';

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectAPI.getOne(id),
        taskAPI.getAll({ project: id }),
      ]);
      setData(projRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, { email: memberEmail, role: memberRole });
      toast.success('Member added');
      setMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({ ...taskForm, project: id });
      toast.success('Task created');
      setTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', status: 'todo' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  if (!project) {
    return <p className="text-center text-gray-500">Project not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/projects" className="text-sm text-primary-600 hover:underline">← Back to Projects</Link>
            <h2 className="mt-2 text-2xl font-bold">{project.title}</h2>
            <p className="mt-2 text-gray-500">{project.description}</p>
          </div>
          {isProjectAdmin && (
            <div className="flex gap-2">
              <button onClick={() => setMemberModal(true)} className="btn-secondary">Add Member</button>
              <button onClick={() => setTaskModal(true)} className="btn-primary">Add Task</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h3 className="font-semibold mb-4">Team Members ({project.teamMembers?.length})</h3>
          <ul className="space-y-3">
            {project.teamMembers?.map((m) => (
              <li key={m.user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                    {getInitials(m.user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                  </div>
                </div>
                {isProjectAdmin && m.user._id !== project.createdBy?._id && (
                  <button onClick={() => handleRemoveMember(m.user._id)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Tasks ({tasks.length})</h3>
          <div className="space-y-3">
            {tasks.length ? tasks.map((t) => (
              <TaskCard key={t._id} task={t} canEdit onStatusChange={handleStatusChange} />
            )) : (
              <p className="card text-sm text-gray-500">No tasks in this project</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="user@example.com" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={memberRole} onChange={(e) => setMemberRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Add Member</button>
        </form>
      </Modal>

      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title="Create Task" size="lg">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Title</label>
              <input className="input" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Assign To</label>
              <select className="input" value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {project.teamMembers?.map((m) => (
                  <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Create Task</button>
        </form>
      </Modal>
    </div>
  );
}
