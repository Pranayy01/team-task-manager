import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api/services';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import TaskCard from '../components/tasks/TaskCard';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getStats();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const { stats, statusBreakdown, recentTasks, myTasks, overdueTasksList, projectSummaries } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          color="primary"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard title="Completed" value={stats.completedTasks} color="green" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} />
        <StatCard title="Pending" value={stats.pendingTasks} color="yellow" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Overdue" value={stats.overdueTasks} color="red" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">Task Status Overview</h3>
          <StatusChart data={statusBreakdown} />
        </div>
        <div className="card">
          <h3 className="mb-4 font-semibold">Project Summaries</h3>
          <div className="space-y-4">
            {projectSummaries?.length ? projectSummaries.map((p) => (
              <Link key={p._id} to={`/projects/${p._id}`} className="block rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-sm text-gray-500">{p.completed}/{p.total} tasks</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-primary-600 transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </Link>
            )) : <p className="text-sm text-gray-500">No projects yet</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">My Tasks</h3>
          <div className="space-y-3">
            {myTasks?.length ? myTasks.map((t) => <TaskCard key={t._id} task={t} canEdit />) : <p className="text-sm text-gray-500 card">No tasks assigned to you</p>}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Overdue Tasks</h3>
          <div className="space-y-3">
            {overdueTasksList?.length ? overdueTasksList.map((t) => <TaskCard key={t._id} task={t} />) : <p className="text-sm text-gray-500 card">No overdue tasks</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Recent Tasks</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {recentTasks?.map((t) => <TaskCard key={t._id} task={t} />)}
        </div>
      </div>
    </div>
  );
}
