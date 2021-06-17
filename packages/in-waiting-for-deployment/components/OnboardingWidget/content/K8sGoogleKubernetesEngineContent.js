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

export default function K8sGoogleKubernetesEngineContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.installingTheInstanaAgentOnGoogleKubernetesEngineIsIntegratedInThe')}
        href="https://console.cloud.google.com/marketplace/details/instana-public/instana?q=instana"
        linkText={t('in-waiting-for-deployment:content.googleCloudMarketplace')}
      />
      <Spacer />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.clickOnConfigureAndSelectTheOrganizationOrProjectContainingTheKubernetesClusterYouWantToDeployInstanaToTheFollowingConfigurationsHaveToBeAppliedDuringTheConfigureStepInTheGoogleCloudPlatformConsole'
          )
        ]}
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
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourGkeCluster')}>
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.youLikelyWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevRatherThanTheDefaultKubernetesClusterViaTheInstanaZoneSettingInTheConfigureStep'
            )
          ]}
        />
      </HelpBox>
    </>
  );
}
