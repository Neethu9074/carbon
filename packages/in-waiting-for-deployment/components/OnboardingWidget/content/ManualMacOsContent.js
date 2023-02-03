/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import {
  Description,
  DownloadButton,
  DropDown,
  getAgentDownloadURL,
  HelpBox,
  Listing,
  Row,
  Spacer
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { t } from 'in-i18n';

export default function ManualMacOsContent({ butlerDomain, agentKey, downloadKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'mac', label: t('in-waiting-for-deployment:content.macOs64BitUniversal') },
    { key: 'macStatic', label: t('in-waiting-for-deployment:content.macOs64BitUniversalStatic') }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, downloadKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Or11Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.ibmJ911Preferred'),
            t('in-waiting-for-deployment:content.azulZuluJdk8'),
            t('in-waiting-for-deployment:content.oracleHotspotJdk8'),
            t('in-waiting-for-deployment:content.ibmJ98'),
            t('in-waiting-for-deployment:content.openJdk8'),
            t('in-waiting-for-deployment:content.amazonCorrettoJdk8')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost')
          ]}
        />
      </HelpBox>
    </>
  );
}
