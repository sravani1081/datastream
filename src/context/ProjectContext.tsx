'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, User, Team, AuditEvent, TaskItem, EntityId } from '../types/domain';
import { LocalStorageProvider } from '../providers/local/LocalStorageProvider';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setActiveProjectId: (id: EntityId) => void;
  isLoading: boolean;
  toasts: Toast[];
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  users: User[];
  teams: Team[];
  refreshProjects: () => Promise<void>;
  logAudit: (action: string, resourceType: string, resourceId: string, resourceName: string) => Promise<void>;
  storageProvider: LocalStorageProvider;
}

const storageProvider = new LocalStorageProvider();
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const refreshProjects = async () => {
    try {
      const list = await storageProvider.getProjects();
      setProjects(list);
      if (!activeProject && list.length > 0) {
        setActiveProject(list[0]);
      } else if (activeProject) {
        const found = list.find((p) => p.id === activeProject.id);
        if (found) setActiveProject(found);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshProjects();
      const uList = await storageProvider.getUsers();
      setUsers(uList);
      const tList = await storageProvider.getTeams();
      setTeams(tList);
    };
    init();
  }, []);

  const setActiveProjectId = (id: EntityId) => {
    const target = projects.find((p) => p.id === id);
    if (target) {
      setActiveProject(target);
      addToast('Project Switched', `Active project set to ${target.name}`, 'info');
    }
  };

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = async (action: string, resourceType: string, resourceId: string, resourceName: string) => {
    await storageProvider.logAuditEvent({
      userId: 'usr-1',
      userName: 'Alex Mercer',
      userRole: 'Data Engineer',
      action,
      resourceType,
      resourceId,
      resourceName,
      timestamp: new Date().toISOString(),
    });
  };

  // Keyboard shortcut listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectId,
        isLoading,
        toasts,
        addToast,
        removeToast,
        commandPaletteOpen,
        setCommandPaletteOpen,
        users,
        teams,
        refreshProjects,
        logAudit,
        storageProvider,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
