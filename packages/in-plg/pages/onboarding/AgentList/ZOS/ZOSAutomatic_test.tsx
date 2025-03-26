/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import ZOSAutomatic from 'in-plg/pages/onboarding/AgentList/ZOS/ZOSAutomatic';

describe('ZOSAutomatic Tests', () => {
  it('Check ZOSAutomatic content rendered', async () => {
    render(<ZOSAutomatic id={''} agentKey={''} downloadKey={''} />);

    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.selectTheAgentPackagingMode'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.Packaging'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.zos.RunTheAgentDeploymentCode'))).toBeInTheDocument();
  });

  it('Check ZOSAutomatic side card content rendered', async () => {
    render(<ZOSAutomatic id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.zos.installagentOnZOS'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.zos.installagentOnZOS1'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<ZOSAutomatic id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.zos.dynamic'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.zos.static'));

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
