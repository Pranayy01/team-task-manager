import { statusColors, statusLabels } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}>
      {statusLabels[status] || status}
    </span>
  );
}
