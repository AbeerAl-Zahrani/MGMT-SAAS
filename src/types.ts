
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
}
enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}
enum Plan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}
interface Invitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  organizationId: string;
  expiresAt: Date;
  createdAt: Date;

  organization: Organization;
}
interface Member {
  id: string;
  role: Role;
  userId: string;
  organizationId: string;
  createdAt: Date;

  user: User;
  organization: Organization;
}
interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  memberships: Member[];
  tasks: Task[];
  comments: Comment[];
  notifications: Notification[];
}
interface Subscription {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  plan: Plan;
  status: SubscriptionStatus;

  organization: Organization;
}
interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

  subscription?: Subscription;
  members: Member[];
  projects: Project[];
  invitations: Invitation[];
}
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
memberCount:number
  organization: Organization;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  assignee?: User;
  comments: Comment[];
}
