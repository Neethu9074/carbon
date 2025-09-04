/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import RestrictedAccessMessage from 'in-components/rbac/RestrictedAccessMessage';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { Role } from 'in-types';

export interface LoggingPermissionWrapperProps {
  requiredPermission: keyof Role;
  permissionLabel: string;
  children: React.ReactNode;
}

export default function PermissionWrapper({
  requiredPermission,
  permissionLabel,
  children
}: LoggingPermissionWrapperProps) {
  const [role] = useCurrentUserRole();
  const hasPermission = role?.[requiredPermission];

  if (!hasPermission) {
    return <RestrictedAccessMessage permission={permissionLabel} />;
  }

  return <>{children}</>;
}
