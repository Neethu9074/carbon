/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PermissionWrapper from 'in-logging/navigation/LoggingPermissionWrapper';
import { role } from 'in-stores/user';

jest.mock('in-stores/user', () => ({
  role: {}
}));

jest.mock('in-components/rbac/RestrictedAccessMessage', () => ({
  __esModule: true,
  default: ({ permission }: any) => <div>Access Denied: {permission}</div>
}));

describe('PermissionWrapper', () => {
  const requiredPermission = 'canViewLogs';
  const permissionLabel = 'View Logs';
  const childrenText = 'Logs content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children if user has the required permission', () => {
    (role as any)[requiredPermission] = true;

    render(
      <PermissionWrapper requiredPermission={requiredPermission} permissionLabel={permissionLabel}>
        <div>{childrenText}</div>
      </PermissionWrapper>
    );

    expect(screen.getByText(childrenText)).toBeInTheDocument();
    expect(screen.queryByText(`Access Denied: ${permissionLabel}`)).not.toBeInTheDocument();
  });

  it('should render RestrictedAccessMessage if user does not have the required permission', () => {
    (role as any)[requiredPermission] = false;

    render(
      <PermissionWrapper requiredPermission={requiredPermission} permissionLabel={permissionLabel}>
        <div>{childrenText}</div>
      </PermissionWrapper>
    );

    expect(screen.queryByText(childrenText)).not.toBeInTheDocument();
    expect(screen.getByText(`Access Denied: ${permissionLabel}`)).toBeInTheDocument();
  });
});
