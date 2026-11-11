import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import StatsCard from "./StatsCard";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { GET_TASKS } from "../graphql/queries";
import {
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
} from "../graphql/mutations";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

type Filter = "ALL" | TaskStatus;

interface TasksData {
  tasks: Task[];
}

interface CreateTaskResult {
  createTask: Task;
}

interface UpdateTaskResult {
  updateTask: Task | null;
}

interface DeleteTaskResult {
  deleteTask: boolean;
}

interface CreateTaskVariables {
  input: CreateTaskInput;
}

interface UpdateTaskVariables {
  id: string;
  input: UpdateTaskInput;
}

interface DeleteTaskVariables {
  id: string;
}

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

export default function Dashboard() {
  const { data, loading, error } = useQuery<TasksData>(GET_TASKS, {
    fetchPolicy: "cache-and-network",
  });
  const [createTask] = useMutation<CreateTaskResult, CreateTaskVariables>(
    CREATE_TASK,
    {
      refetchQueries: [{ query: GET_TASKS }],
      awaitRefetchQueries: true,
    },
  );
  const [updateTask] = useMutation<UpdateTaskResult, UpdateTaskVariables>(
    UPDATE_TASK,
    {
      refetchQueries: [{ query: GET_TASKS }],
      awaitRefetchQueries: true,
    },
  );
  const [deleteTask] = useMutation<DeleteTaskResult, DeleteTaskVariables>(
    DELETE_TASK,
    {
      refetchQueries: [{ query: GET_TASKS }],
      awaitRefetchQueries: true,
    },
  );

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const tasks = data?.tasks ?? [];

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "COMPLETED").length,
      progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      pending: tasks.filter((task) => task.status === "TODO").length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === "ALL" || task.status === filter;
      const matchesSearch =
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.assignee.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  async function handleSave(input: CreateTaskInput) {
    if (editingTask) {
      await updateTask({
        variables: {
          id: editingTask.id,
          input,
        },
      });
    } else {
      await createTask({ variables: { input } });
    }

    setShowForm(false);
    setEditingTask(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask({ variables: { id } });
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error ? deleteError.message : "Delete failed",
      );
    }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    try {
      await updateTask({
        variables: {
          id,
          input: { status },
        },
      });
    } catch (updateError) {
      window.alert(
        updateError instanceof Error ? updateError.message : "Update failed",
      );
    }
  }

  if (loading && !data) {
    return <div className="page-message">Loading tasks...</div>;
  }

  if (error && !data) {
    return (
      <div className="page-message error-message">
        Could not connect to GraphQL server.
        <p>{error.message}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            T
          </div>
          <h2>TaskFlow</h2>
        </div>
        <p className="nav-heading">WORKSPACE</p>
        <nav aria-label="Main navigation">
          <a className="nav-link active" aria-current="page">
            <LayoutDashboard size={19} aria-hidden="true" />
            Dashboard
          </a>
          <a className="nav-link">
            <ListTodo size={19} aria-hidden="true" />
            My Tasks
          </a>
          <a className="nav-link">
            <FolderKanban size={19} aria-hidden="true" />
            Projects
          </a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-link">
            <Settings size={19} aria-hidden="true" />
            Settings
          </a>
          <div className="profile">
            <div className="avatar" aria-hidden="true">
              V
            </div>
            <div>
              <strong>Vamsi</strong>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your tasks and track your progress.</p>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <Plus size={18} aria-hidden="true" />
            Create Task
          </button>
        </header>

        {error && data && (
          <p className="inline-error" role="alert">
            Could not refresh tasks: {error.message}
          </p>
        )}

        <section className="stats-grid" aria-label="Task statistics">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            type="total"
            color="#eeeaff"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            type="completed"
            color="#e4f8ed"
          />
          <StatsCard
            title="In Progress"
            value={stats.progress}
            type="progress"
            color="#fff3dd"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            type="pending"
            color="#ffe9eb"
          />
        </section>

        <section className="tasks-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Tasks</h2>
              <p>View and manage all your tasks.</p>
            </div>
          </div>
          <div className="toolbar">
            <div className="filter-buttons" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={
                    filter === item.value
                      ? "filter-button selected"
                      : "filter-button"
                  }
                  onClick={() => setFilter(item.value)}
                  aria-pressed={filter === item.value}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Search size={17} aria-hidden="true" />
              <span className="visually-hidden">Search tasks or assignees</span>
              <input
                placeholder="Search tasks or assignees..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <TaskList
            tasks={filteredTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
          {loading && <p className="refresh-message">Refreshing tasks...</p>}
        </section>

        <footer className="footer">
          TaskFlow · GraphQL-powered task management
        </footer>
      </main>

      {showForm && (
        <TaskForm
          initialTask={editingTask}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
