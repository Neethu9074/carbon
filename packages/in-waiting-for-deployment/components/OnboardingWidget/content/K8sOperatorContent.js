/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  Description,
  HelpBox,
  Script,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function K8sOperatorContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.installingTheInstanaAgentUsingTheKubernetesOperatorIsDescribedIn')}
        href="https://instana.com/docs/setup_and_manage/host_agent/on/kubernetes/#install-using-the-operator"
        linkText={t('in-waiting-for-deployment:content.theInstanaKubernetesDocumentation')}
      />
      <Spacer />
      <TextWithLink
        text={t('in-waiting-for-deployment:content.theFollowingConfigurationValuesWillBeNeededToBePopulatedInThe')}
        href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
        linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServiceEndpoint')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServicePort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaApplicationKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourKubernetesCluster')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.youWillAlsoWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevUsingTheClusterNameOptionInThe'
          )}
          href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
          linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
        />
      </HelpBox>
    </>
  );
}
