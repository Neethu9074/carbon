/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import Unix from 'in-plg/pages/onboarding/AgentList/Unix/Unix';

describe('Unix Tests', () => {
  it('Check Unix content rendered', async () => {
    render(<Unix id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.windows.windows_ec2_64.selectTheAgentPackagingMode'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.gcp.installationMethod'))).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.common.step2') + t('in-plg:agentDetails.unix.selectThePlatformArchitecture')
      )
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.unix.platformArchitecture'))).toBeInTheDocument();
  });

  it('Check Unix side card content rendered', async () => {
    render(<Unix id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.unix.previewPrerequisites'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.unix.installingInstanaAgent'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Installation method', () => {
    render(<Unix id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.agentMode.dynamic'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.agentMode.static'));

    // Check default checked option when page loads
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    // Click the first option and check that it is selected
    fireEvent.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    // Click the second option and check that it is selected
    fireEvent.click(option2);
    expect(option1).not.toBeChecked();
    expect(option2).toBeChecked();
  });

  it('Should select dropdown correctly', async () => {
    render(<Unix id={''} agentKey={''} downloadKey={''} />);

    // Check if the dropdown is rendered
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check if all options are present
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });
});
