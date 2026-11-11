import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  color: string;
  type: "total" | "completed" | "progress" | "pending";
}

const icons = {
  total: ClipboardList,
  completed: CheckCircle2,
  progress: Clock3,
  pending: AlertCircle,
};

export default function StatsCard({
  title,
  value,
  color,
  type,
}: StatsCardProps) {
  const Icon = icons[type];

  return (
    <article className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: color }}>
        <Icon size={24} aria-hidden="true" />
      </div>
      <div>
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </article>
  );
}
