/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import Openshift from 'in-plg/pages/onboarding/AgentList/Openshift/Openshift';

describe('Openshift Tests', () => {
  it('Check Openshift content rendered', async () => {
    render(<Openshift id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.openshift.instructions.enterAClusterNameAndOptionallyTheAgentZone'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.clusterName'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.openshift.instructions.reviewPrerequisiteAndRunCode'))
    ).toBeInTheDocument();
  });

  it('Check Openshift side card content rendered', async () => {
    render(<Openshift id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.prerequisitesTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.documentationTitle'))).toBeInTheDocument();
  });
});
