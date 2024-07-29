/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import KubernetesOperator from 'in-plg/pages/onboarding/AgentList/Kubernetes/KubernetesOperator';

describe('KubernetesOperator Tests', () => {
  it('Check KubernetesOperator content rendered', async () => {
    render(<KubernetesOperator id={''} agentKey={''} downloadKey={''} />);
    expect(
      screen.getByText(t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.kubernetes.operator.installOperatorsManually'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.kubernetes.operator.theLatestOperatorWillBeInstalled'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t(
          'in-plg:agentDetails.kubernetes.operator.enterAClusterNameAndOptionallyTheAgentZoneThatYouWantTheClusterToBePartOf'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.clusterName'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.kubernetes.operator.configureTheCustomResourceYAMLFile'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.kubernetes.operator.runTheFollowingCommandToDeployTheInstanaAgent'))
    ).toBeInTheDocument();
  });

  it('Check KubernetesOperator side card content rendered', async () => {
    render(<KubernetesOperator id={''} agentKey={''} downloadKey={''} />);
    expect(screen.getByText(t('in-plg:agentDetails.common.sideCard.prerequisites'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.choosingTheProperInstallationMethod'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.networkRequirements'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.sideCard.documentation'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.kubernetes.operator.installUsingTheOperator'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-plg:agentDetails.kubernetes.operator.installAnAgentOnKubernetes'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:agentDetails.common.configuringTheAgentAfterInstall'))).toBeInTheDocument();
  });
});
