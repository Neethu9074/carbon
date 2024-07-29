/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import LinuxGoogleCloudComputing from 'in-plg/pages/onboarding/AgentList/Linux/LinuxGoogleCloudComputing';

describe('LinuxGoogleCloudComputing Tests', () => {
  it('Check LinuxGoogleCloudComputing content rendered', async () => {
    render(<LinuxGoogleCloudComputing id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.selectTheAgentPackagingMode'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.Packaging'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.dynamic'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.static'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.runtime'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.azulZulu'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.eclipseOpenJ9'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.reviewThePrerequisitesAndRunTheAgentDeploymentCode'))
    ).toBeInTheDocument();
  });

  it('Check LinuxGoogleCloudComputing side card content rendered', async () => {
    render(<LinuxGoogleCloudComputing id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_gce.installAnAgentOnLinux'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_gce.configurationParameters'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<LinuxGoogleCloudComputing id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.linux.linux_ec2.dynamic'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.linux.linux_ec2.static'));

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

  it('should select the correct radio button when clicked for Runtime', () => {
    render(<LinuxGoogleCloudComputing id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.linux.linux_ec2.azulZulu'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.linux.linux_ec2.eclipseOpenJ9'));

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
});
