export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
