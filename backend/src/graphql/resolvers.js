import { randomUUID } from "node:crypto";
import { tasks } from "../data/tasks.js";

export const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find((task) => task.id === id) ?? null,
    tasksByStatus: (_, { status }) =>
      tasks.filter((task) => task.status === status),
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = {
        id: randomUUID(),
        ...input,
      };
      tasks.push(task);
      return task;
    },
    updateTask: (_, { id, input }) => {
      const task = tasks.find((item) => item.id === id);
      if (!task) {
        return null;
      }

      Object.assign(task, input);
      return task;
    },
    deleteTask: (_, { id }) => {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        return false;
      }

      tasks.splice(index, 1);
      return true;
    },
  },
};
