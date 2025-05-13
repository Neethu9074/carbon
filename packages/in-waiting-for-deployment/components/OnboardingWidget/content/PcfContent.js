/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  Description,
  HelpBox,
  Listing,
  Script,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function PcfContent({ agentKey, downloadKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.downloadTheInstanaMicroservicesApplicationMonitoringTileFrom"
        href="https://support.broadcom.com/group/ecx/productdownloads?subfamily=Instana%20Microservices%20Application%20Monitoring%20for%20VMware%20Tanzu"
      />
      <Spacer />
      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.uploadTheInstanaMicroservicesApplicationMonitoringTileToYourOpsManagerAsDescribedInThe"
        href="https://www.ibm.com/docs/en/instana-observability/latest?topic=tanzu-installing-configuring-microservices-applications"
      />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.theFollowingConfigurationsHaveToBeAppliedToTheBackendConfigurationTabOfTheInstanaMicroservicesApplicationMonitoringTileInOpsManager'
          )
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.endpointHost')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.endpointPort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.agentKey')]} />
          <Script lines={[agentKey]} />
        </Col>
        <Col xs={6}>
          <Description lines={[t('in-waiting-for-deployment:content.downloadKey')]} />
          <Script lines={[downloadKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.finallyYouWillNeedToGiveYourVMwareTanzuFoundationANameForExampleProdEuOrDev01ViaTheAgentZoneSettingInTheAgentConfigurationTab'
          )
        ]}
      />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.applyTheChangesIntroducedByTheInstanaMicroservicesApplicationMonitoringTileToAllTilesInTheOpsManagerTilesThatAreNotSelectedForTheApplyChangesStepInOpsManagerWillNotBeVisibleInInstana'
          )
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedOpsManagerVersions')}>
        <Listing items={['2.3+']} />
      </HelpBox>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedStemcells')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.ubuntuTrusty'),
            t('in-waiting-for-deployment:content.ubuntuXenial')
          ]}
        />
      </HelpBox>
    </>
  );
}
