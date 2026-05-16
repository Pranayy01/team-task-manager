import { priorityColors } from '../../utils/helpers';

export default function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColors[priority]}`}>
      {priority}
    </span>
  );
}
