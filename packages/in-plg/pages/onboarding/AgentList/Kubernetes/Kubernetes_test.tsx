/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import Kubernetes from 'in-plg/pages/onboarding/AgentList/Kubernetes/Kubernetes';

describe('Kubernetes Tests', () => {
  it('Check Kubernetes content rendered', async () => {
    render(<Kubernetes id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.kubernetes.kubernetes.enterAClusterNameAndOptionallyTheAgentZone'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.clusterName'))).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-plg:agentDetails.kubernetes.kubernetes.reviewThePrerequisitesAndRunTheAgentDeploymentCode')
      )
    ).toBeInTheDocument();
  });

  it('Check Kubernetes side card content rendered', async () => {
    render(<Kubernetes id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
  });
});
