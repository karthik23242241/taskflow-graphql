import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CreateTaskInput,
  Priority,
  Task,
  TaskStatus,
} from "../types/task";

interface TaskFormProps {
  initialTask?: Task | null;
  onSave: (input: CreateTaskInput) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({
  initialTask,
  onSave,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialTask?.title ?? "");
    setDescription(initialTask?.description ?? "");
    setAssignee(initialTask?.assignee ?? "");
    setStatus(initialTask?.status ?? "TODO");
    setPriority(initialTask?.priority ?? "MEDIUM");
    setDueDate(initialTask?.dueDate ?? "");
    setError("");
  }, [initialTask]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !assignee.trim() || !dueDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        assignee: assignee.trim(),
        status,
        priority,
        dueDate,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save task.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <div>
            <h2>{initialTask ? "Edit Task" : "Create New Task"}</h2>
            <p>Enter the task details below.</p>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onCancel}
            aria-label="Close task form"
          >
            ×
          </button>
        </div>

        <label htmlFor="task-title">Task Title *</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the task"
          rows={3}
        />

        <label htmlFor="task-assignee">Assignee *</label>
        <input
          id="task-assignee"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          placeholder="Enter employee name"
          required
        />

        <div className="form-grid">
          <div>
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Priority)
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <label htmlFor="task-due-date">Due Date *</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : initialTask ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
