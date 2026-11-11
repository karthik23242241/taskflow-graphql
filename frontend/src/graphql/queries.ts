import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      priority
      assignee
      dueDate
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: TaskStatus!) {
    tasksByStatus(status: $status) {
      id
      title
      description
      status
      priority
      assignee
      dueDate
    }
  }
`;
