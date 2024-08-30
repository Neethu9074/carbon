/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import Docker from 'in-plg/pages/onboarding/AgentList/Docker/Docker';

describe('Docker Tests', () => {
  it('Check Docker content rendered', async () => {
    render(<Docker id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.enterAClusterNameAndOptionallyTheAgentZone')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.kubernetes.kubernetes.reviewThePrerequisitesAndRunTheAgentDeploymentCode')
      )
    ).toBeInTheDocument();
  });

  it('Check Docker side card content rendered', async () => {
    render(<Docker id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.docker.pullTheAgentContainerImage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.docker.runTheInstanaAgentContainerImage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.docker.upgradeTheInstanaAgentContainerImage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.docker.installAgentOnDocker'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.docker.configurationOptions'))).toBeInTheDocument();
  });
});
