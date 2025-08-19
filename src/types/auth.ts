export type UserRole = 'admin' | 'employer' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  website?: string;
  location?: string;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  onboardingCompleted: boolean;
  onboardingStep?: number;
}

export interface Permission {
  resource:
    | 'employees'
    | 'invoices'
    | 'projects'
    | 'files'
    | 'settings'
    | 'analytics';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface TeamMember {
  id: string;
  userId: string;
  projectId?: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: Permission[];
  invitedBy: string;
  invitedAt: Date;
  acceptedAt?: Date;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'employees', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'files', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  employer: [
    { resource: 'employees', actions: ['create', 'read', 'update'] },
    { resource: 'invoices', actions: ['create', 'read', 'update'] },
    { resource: 'projects', actions: ['create', 'read', 'update'] },
    { resource: 'files', actions: ['create', 'read', 'update'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  employee: [
    { resource: 'employees', actions: ['read'] },
    { resource: 'invoices', actions: ['read'] },
    { resource: 'projects', actions: ['read', 'update'] },
    { resource: 'files', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
  ],
};

