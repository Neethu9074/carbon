/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render } from '@testing-library/react';
import React from 'react';

import { ConfigurationSummary } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import { t } from 'in-i18n';

const messages = {
  accessLevelTitle: 'Access all',
  accessLevel: 'Access all items under this unit',
  rolePermission: 'View, create, delete and configure items.',
  noAccess: "Can't access this area at all."
};

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary/ConfigurationSummary', () => {
  test('should render ConfigurationSummary', () => {
    const { getByText, queryByText } = render(
      <ConfigurationSummary accessLevelMsg={messages.accessLevel} rolePermissionMsg={messages.rolePermission} />
    );

    // Check that all labels and messages are displayed
    expect(getByText(t('in-settings:permissionScope.permissions'))).toBeVisible();
    expect(getByText(t('in-settings:permissionScope.access_type'))).toBeVisible();
    expect(getByText(t('in-settings:permissionScope.selection', { context: messages.accessLevelTitle }))).toBeVisible();
    expect(getByText(messages.accessLevel)).toBeVisible();
    expect(getByText(messages.rolePermission)).toBeVisible();
    // No access should not be shown
    expect(queryByText(messages.noAccess)).not.toBeInTheDocument();
  });

  test('should render no access message when noAccess enabled', () => {
    const { getByText, queryByText } = render(
      <ConfigurationSummary
        accessLevelMsg={messages.accessLevel}
        rolePermissionMsg={messages.rolePermission}
        noAccess
        noAccessMsg={messages.noAccess}
      />
    );

    // Only no access message should be shown
    expect(getByText(t('in-settings:permissionScope.permissions'))).toBeVisible();
    expect(getByText(messages.noAccess)).toBeVisible();
    // Access level and role / permissions messages should not be shown
    expect(queryByText(t('in-settings:permissionScope.access_type'))).not.toBeInTheDocument();
    expect(
      queryByText(t('in-settings:permissionScope.selection', { context: messages.accessLevelTitle }))
    ).not.toBeInTheDocument();
    expect(queryByText(messages.accessLevel)).not.toBeInTheDocument();
    expect(queryByText(messages.rolePermission)).not.toBeInTheDocument();
  });
});
