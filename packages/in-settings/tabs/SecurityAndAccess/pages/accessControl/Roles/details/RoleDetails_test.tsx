/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import { useParams } from 'react-router';
import React from 'react';

import RoleDetails from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/details/RoleDetails';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useRoleDetails from 'in-settings/tabs/SecurityAndAccess/hooks/useRoleDetails';
import { Capability, LimitedAccessScope } from 'in-stores/permission';
import { success } from 'in-services/util/result';

jest.mock('react-router');
jest.mock('in-settings/tabs/SecurityAndAccess/hooks/useRoleDetails');

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/details/RoleDetails', () => {
  it('must render the corrent role name', () => {
    // Given
    (useParams as jest.Mock).mockReturnValue({ id: 'foo' });
    (useRoleDetails as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(success({ name: 'Foo', permissions: [] }))
    );
    const selector = 'h3';

    // When
    const { getByText } = render(<RoleDetails />);
    const roleTitle = getByText('Foo', { selector });

    // Then
    expect(roleTitle).toBeTruthy();
  });

  it('must render correct permissions count in title', () => {
    // Given
    (useParams as jest.Mock).mockReturnValue({ id: 'foo' });
    (useRoleDetails as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          name: 'Foo',
          permissions: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE, Capability.CAN_CONFIGURE_EUM_APPLICATIONS]
        })
      )
    );
    const selector = 'h4';

    // When
    const { getByText } = render(<RoleDetails />);
    const roleTitle = getByText('Permissions (2 / 63)', { selector });

    // Then
    expect(roleTitle).toBeTruthy();
  });

  it('must render all permission sections', () => {
    // Given
    (useParams as jest.Mock).mockReturnValue({ id: 'foo' });
    (useRoleDetails as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(success({ name: 'Foo', permissions: [] }))
    );
    const selector = 'ul > li span';

    // When
    const { getByText } = render(<RoleDetails />);
    const websitesSection = getByText('Websites', { selector });
    const mobileAppsSection = getByText('Mobile apps', { selector });
    const businessProcessesSection = getByText('Business processes', { selector });
    const applicationsSection = getByText('Applications', { selector });
    const platformsSection = getByText('Platforms', { selector });
    const infrastructureSection = getByText('Infrastructure', { selector });
    const customDashboardsSection = getByText('Custom dashboards', { selector });
    const logsSection = getByText('Logs', { selector });
    const syntheticsSection = getByText('Synthetic monitoring', { selector });
    const automationSection = getByText('Automation', { selector });
    const eventsAndAlertsSection = getByText('Events and alerts management', { selector });
    const globalFunctionsSection = getByText('Global functions', { selector });
    const agentDeploymentSection = getByText('Agent deployment', { selector });
    const accessControlSection = getByText('Access control', { selector });

    // Then
    expect(websitesSection).toBeTruthy();
    expect(mobileAppsSection).toBeTruthy();
    expect(businessProcessesSection).toBeTruthy();
    expect(applicationsSection).toBeTruthy();
    expect(platformsSection).toBeTruthy();
    expect(infrastructureSection).toBeTruthy();
    expect(customDashboardsSection).toBeTruthy();
    expect(logsSection).toBeTruthy();
    expect(syntheticsSection).toBeTruthy();
    expect(automationSection).toBeTruthy();
    expect(eventsAndAlertsSection).toBeTruthy();
    expect(globalFunctionsSection).toBeTruthy();
    expect(agentDeploymentSection).toBeTruthy();
    expect(agentDeploymentSection).toBeTruthy();
    expect(accessControlSection).toBeTruthy();
  });
});
