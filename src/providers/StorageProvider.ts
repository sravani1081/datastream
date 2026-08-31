// StorageProvider Interface

import { Project, User, Team, AuditEvent, TaskItem, EntityId } from '../types/domain';

export interface StorageProvider {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectById(id: EntityId): Promise<Project | null>;
  saveProject(project: Project): Promise<Project>;
  deleteProject(id: EntityId): Promise<boolean>;

  // Users & Teams
  getUsers(): Promise<User[]>;
  getTeams(): Promise<Team[]>;

  // Audit Logs
  getAuditEvents(projectId?: EntityId): Promise<AuditEvent[]>;
  logAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuditEvent>;

  // Tasks
  getTasks(projectId?: EntityId): Promise<TaskItem[]>;
  saveTask(task: TaskItem): Promise<TaskItem>;
  deleteTask(id: EntityId): Promise<boolean>;
}
