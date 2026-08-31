// LocalStorageProvider Implementation

import { StorageProvider } from '../StorageProvider';
import { Project, User, Team, AuditEvent, TaskItem, EntityId } from '../../types/domain';
import {
  INITIAL_PROJECTS,
  INITIAL_USERS,
  INITIAL_TEAMS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_TASKS,
} from './initialData';

const STORAGE_KEYS = {
  PROJECTS: 'datastream_projects_v1',
  USERS: 'datastream_users_v1',
  TEAMS: 'datastream_teams_v1',
  AUDIT_LOGS: 'datastream_audit_logs_v1',
  TASKS: 'datastream_tasks_v1',
};

export class LocalStorageProvider implements StorageProvider {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient()) return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }

  async getProjects(): Promise<Project[]> {
    return this.getItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  async getProjectById(id: EntityId): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  async saveProject(project: Project): Promise<Project> {
    const projects = await this.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    const now = new Date().toISOString();
    const updatedProject = { ...project, updatedAt: now };

    if (idx >= 0) {
      projects[idx] = updatedProject;
    } else {
      updatedProject.createdAt = now;
      projects.unshift(updatedProject);
    }

    this.setItem(STORAGE_KEYS.PROJECTS, projects);
    return updatedProject;
  }

  async deleteProject(id: EntityId): Promise<boolean> {
    const projects = await this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }

  async getUsers(): Promise<User[]> {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  async getTeams(): Promise<Team[]> {
    return this.getItem<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  }

  async getAuditEvents(projectId?: EntityId): Promise<AuditEvent[]> {
    const logs = this.getItem<AuditEvent[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_EVENTS);
    if (!projectId) return logs;
    return logs.filter((l) => !l.resourceId || l.resourceId === projectId);
  }

  async logAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuditEvent> {
    const logs = await this.getAuditEvents();
    const now = new Date().toISOString();
    const newLog = {
      ...event,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    } as AuditEvent;
    logs.unshift(newLog);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
    return newLog;
  }

  async getTasks(projectId?: EntityId): Promise<TaskItem[]> {
    const tasks = this.getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    if (!projectId) return tasks;
    return tasks.filter((t) => t.projectId === projectId);
  }

  async saveTask(task: TaskItem): Promise<TaskItem> {
    const tasks = await this.getTasks();
    const idx = tasks.findIndex((t) => t.id === task.id);
    const now = new Date().toISOString();
    const updated = { ...task, updatedAt: now };

    if (idx >= 0) {
      tasks[idx] = updated;
    } else {
      updated.createdAt = now;
      tasks.unshift(updated);
    }
    this.setItem(STORAGE_KEYS.TASKS, tasks);
    return updated;
  }

  async deleteTask(id: EntityId): Promise<boolean> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TASKS, filtered);
    return true;
  }
}
