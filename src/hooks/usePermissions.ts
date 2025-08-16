import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Permission, UserRole, ROLE_PERMISSIONS } from '../types/auth';

export const usePermissions = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('usePermissions must be used within an AuthProvider');
  }
  const { currentUser } = context;

  const hasPermission = (
    resource: Permission['resource'],
    action: Permission['actions'][0]
  ): boolean => {
    if (!currentUser) return false;

    // Get user role (default to client for now)
    const userRole: UserRole = currentUser.role || 'client';
    const permissions = ROLE_PERMISSIONS[userRole];

    const resourcePermission = permissions.find(p => p.resource === resource);
    return resourcePermission?.actions.includes(action) || false;
  };

  const canCreate = (resource: Permission['resource']) => hasPermission(resource, 'create');
  const canRead = (resource: Permission['resource']) => hasPermission(resource, 'read');
  const canUpdate = (resource: Permission['resource']) => hasPermission(resource, 'update');
  const canDelete = (resource: Permission['resource']) => hasPermission(resource, 'delete');

  return {
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userRole: currentUser?.role || 'client',
  };
};
