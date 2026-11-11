export const typeDefs = `#graphql
  enum TaskStatus {
    TODO
    IN_PROGRESS
    COMPLETED
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    assignee: String!
    dueDate: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    assignee: String!
    dueDate: String!
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: Priority
    assignee: String
    dueDate: String
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByStatus(status: TaskStatus!): [Task!]!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean!
  }
`;
