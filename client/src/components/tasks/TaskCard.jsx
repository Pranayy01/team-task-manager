import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { formatDate, isOverdue, getInitials } from '../../utils/helpers';

export default function TaskCard({ task, onStatusChange, canEdit = false }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {overdue && (
              <span className="text-xs font-medium text-red-600 dark:text-red-400">Overdue</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {task.project && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {typeof task.project === 'object' ? task.project.title : task.project}
              </span>
            )}
            <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {task.assignedTo && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              title={task.assignedTo.name}
            >
              {getInitials(task.assignedTo.name)}
            </div>
          )}
          {canEdit && onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="input py-1 text-xs w-32"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
