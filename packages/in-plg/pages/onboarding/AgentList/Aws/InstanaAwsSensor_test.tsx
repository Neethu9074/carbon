/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import InstanaAwsSensor from 'in-plg/pages/onboarding/AgentList/Aws/InstanaAwsSensor';

describe('InstanaAwsSensor Tests', () => {
  it('Check InstanaAwsSensor content rendered', async () => {
    render(<InstanaAwsSensor id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectWhereToRunAwsAgentOn'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.gcp.installationMethod'))).toBeInTheDocument();
  });

  it('Check InstanaAwsSensor side card content rendered', async () => {
    render(<InstanaAwsSensor id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.documentationLinks.monitoredAwsServices'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.documentationLinks.installAgentOnEc2'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.documentationLinks.configurationOptions'))).toBeInTheDocument();
  });

  it('should select the correct radio button when clicked for Packaging', () => {
    render(<InstanaAwsSensor id={''} agentKey={''} downloadKey={''} />);

    // Get the radio buttons by their label text
    const option1 = screen.getByLabelText(t('in-plg:agentDetails.aws.ec2'));
    const option2 = screen.getByLabelText(t('in-plg:agentDetails.aws.ecs'));

    // Check default checked option when page loads
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    // Click the first option and check that it is selected
    fireEvent.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    expect(
      screen.getByText(
        t('in-plg:agentDetails.aws.step2') +
          t('in-plg:agentDetails.aws.reviewThePrerequisitesAndRunTheAgentDeploymentCode')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.aws.step3') + t('in-plg:agentDetails.aws.setIAMPermissionsAndEditTrustRelationship')
      )
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.iamPermissions'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.trustRelationships'))).toBeInTheDocument();

    // Click the second option and check that it is selected
    fireEvent.click(option2);
    expect(option1).not.toBeChecked();
    expect(option2).toBeChecked();

    expect(
      screen.getByText(t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.createECSTaskDefinition'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.createECSTaskDefinition'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.taskDefinition'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.aws.assignECSTaskDefinitionWithFollowingIAMPermission'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.iamPermissions'))).toBeInTheDocument();
  });
});
