/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import { newOTelPageEnabled } from 'in-services/featureFlags';

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog', () => {
  it('must render all permission sections', () => {
    // Given
    const selector = 'nav > ul > li > span';
    const mode = 'new';

    // When
    const { getByText } = render(<EditRoleDialog mode={mode} />);
    const generalSection = getByText('General', { selector });
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
    const agentDeploymentSection = getByText(newOTelPageEnabled ? 'Datasources' : 'Agent deployment', { selector });
    const accessControlSection = getByText('Access control', { selector });

    // Then
    expect(generalSection).toBeTruthy();
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
