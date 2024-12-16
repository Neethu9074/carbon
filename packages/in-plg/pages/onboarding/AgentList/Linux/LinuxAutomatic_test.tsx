/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import LinuxAutomatic from 'in-plg/pages/onboarding/AgentList/Linux/LinuxAutomatic';

describe('LinuxAutomatic Tests', () => {
  it('Check LinuxAutomatic content rendered', async () => {
    render(<LinuxAutomatic id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.windows.windows_ec2_64.selectTheAgentPackagingMode'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.Packaging'))).toBeInTheDocument();
    expect(screen.getByText(t('in-waiting-for-deployment:content.agentModeDynamic'))).toBeInTheDocument();
    expect(screen.getByText(t('in-waiting-for-deployment:content.agentModeStatic'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-waiting-for-deployment:content.agentInstallationModeInteractive'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-waiting-for-deployment:content.agentInstallationModeSilent'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.reviewThePrerequisitesAndRunTheAgentDeploymentCode'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-waiting-for-deployment:content.installAndStartAsServiceOnlySupportedForSystemDBasedSystems')
      )
    ).toBeInTheDocument();
  });

  it('Check LinuxAutomatic side card content rendered', async () => {
    render(<LinuxAutomatic id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_auto.installAnAgentOnLinux'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_auto.configurationParameters'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_auto.troubleshootingInstallation'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_auto.runningTheAgent'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<LinuxAutomatic id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-waiting-for-deployment:content.agentModeDynamic'));
    const option2 = screen.getByLabelText(t('in-waiting-for-deployment:content.agentModeStatic'));

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

  it('should select the correct radio button when clicked for first Runtime', () => {
    render(<LinuxAutomatic id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText('Azul Zulu 11');
    const option2 = screen.getByLabelText('Eclipse OpenJ9 11');

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

  it('should select the correct radio button when clicked for second Runtime', () => {
    render(<LinuxAutomatic id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-waiting-for-deployment:content.agentInstallationModeInteractive'));
    const option2 = screen.getByLabelText(t('in-waiting-for-deployment:content.agentInstallationModeSilent'));

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
