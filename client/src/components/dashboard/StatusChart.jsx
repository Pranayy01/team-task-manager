import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#9ca3af', '#3b82f6', '#22c55e'];
const LABELS = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };

export default function StatusChart({ data }) {
  const chartData = (data || []).map((item) => ({
    name: LABELS[item._id] || item._id,
    value: item.count,
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No task data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
