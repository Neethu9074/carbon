/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import AwsEc2Linux from 'in-plg/pages/onboarding/AgentList/Aws/AwsEc2Linux';

describe('AwsEc2Linux Tests', () => {
  it('Check AwsEc2Linux content rendered', async () => {
    render(<AwsEc2Linux id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectAgentPackagingAndRuntime'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.packaging'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.runtime'))).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.useScriptAsUserDataForEc2Instance')
      )
    ).toBeInTheDocument();
  });

  it('Check AwsEc2Linux side card content rendered', async () => {
    render(<AwsEc2Linux id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.installagentOnAWSEC2'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.RuncommandsonAWSES2'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.linux.linux_ec2.configurationParameters'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<AwsEc2Linux id={''} agentKey={''} downloadKey={''} />);

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

  it('should select the correct radio button when clicked for Runtime', () => {
    render(<AwsEc2Linux id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.jvmVendor.azulZulu11'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.jvmVendor.eclipseOpenJD11'));

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
