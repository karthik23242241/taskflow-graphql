import { Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void | Promise<void>;
  onStatusChange: (id: string, status: TaskStatus) => void | Promise<void>;
}

function statusLabel(status: TaskStatus) {
  if (status === "TODO") {
    return "Pending";
  }
  return status === "IN_PROGRESS" ? "In Progress" : "Completed";
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Assignee</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Due Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                {task.description && <small>{task.description}</small>}
              </td>
              <td>{task.assignee}</td>
              <td>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>
              <td>
                <select
                  className={`status-select ${task.status.toLowerCase()}`}
                  value={task.status}
                  onChange={(event) =>
                    onStatusChange(task.id, event.target.value as TaskStatus)
                  }
                  aria-label={`Status for ${task.title}`}
                >
                  <option value="TODO">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <span className="visually-hidden">
                  Current status: {statusLabel(task.status)}
                </span>
              </td>
              <td>
                {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                  "en-IN",
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => onEdit(task)}
                    aria-label={`Edit ${task.title}`}
                  >
                    <Pencil size={17} aria-hidden="true" />
                  </button>
                  <button
                    className="icon-button delete"
                    type="button"
                    onClick={() => onDelete(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-state">
                No tasks found. Create your first task!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
