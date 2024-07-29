/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import LinuxArchive from 'in-plg/pages/onboarding/AgentList/Linux/LinuxArchive';

describe('LinuxArchive Tests', () => {
  it('Check LinuxArchive content rendered', async () => {
    render(<LinuxArchive id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.selectTheAgentPackagingMode'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.packaging'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.selecTthePlatformArchitecture'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.platformArchitecture'))).toBeInTheDocument();
  });

  it('Check LinuxArchive side card content rendered', async () => {
    render(<LinuxArchive id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.hostRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.installUsingATarFile'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.archive.startingTheAgent'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<LinuxArchive id={''} agentKey={''} downloadKey={''} />);

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
    render(<LinuxArchive id={''} agentKey={''} downloadKey={''} />);

    // Check if the dropdown is rendered
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check if all options are present
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(8);
  });
});
