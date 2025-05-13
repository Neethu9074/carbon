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

export default function K8sOperatorContent({ downloadKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.installingTheInstanaAgentUsingTheKubernetesOperatorIsDescribedIn"
        href="https://www.ibm.com/docs/en/instana-observability/latest?topic=agents-installing-host-agent-kubernetes#install-by-using-the-operator"
      />
      <Spacer />
      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.theFollowingConfigurationValuesWillBeNeededToBePopulatedInThe"
        href="https://github.com/instana/instana-agent-operator/blob/main/config/samples/instana_v1_instanaagent.yaml"
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
          <Script lines={[downloadKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourKubernetesCluster')}>
        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.youWillAlsoWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevUsingTheClusterNameOptionInThe"
          href="https://github.com/instana/instana-agent-operator/blob/main/config/samples/instana_v1_instanaagent.yaml"
        />
      </HelpBox>
    </>
  );
}
