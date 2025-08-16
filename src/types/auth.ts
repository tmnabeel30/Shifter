export type UserRole = 'admin' | 'freelancer' | 'client' | 'team_member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  onboardingCompleted: boolean;
  onboardingStep?: number;
}

export interface Permission {
  resource: 'clients' | 'invoices' | 'projects' | 'files' | 'settings' | 'analytics';
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
    { resource: 'clients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'files', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  freelancer: [
    { resource: 'clients', actions: ['create', 'read', 'update'] },
    { resource: 'invoices', actions: ['create', 'read', 'update'] },
    { resource: 'projects', actions: ['create', 'read', 'update'] },
    { resource: 'files', actions: ['create', 'read', 'update'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  client: [
    { resource: 'clients', actions: ['read'] },
    { resource: 'invoices', actions: ['read'] },
    { resource: 'projects', actions: ['read'] },
    { resource: 'files', actions: ['read'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
  ],
  team_member: [
    { resource: 'clients', actions: ['read'] },
    { resource: 'invoices', actions: ['read'] },
    { resource: 'projects', actions: ['read', 'update'] },
    { resource: 'files', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
  ],
};

