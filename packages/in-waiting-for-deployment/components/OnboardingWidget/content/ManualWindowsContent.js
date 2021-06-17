/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, {  useState } from 'react';

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

export default function ManualWindowsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'win64', label: t('in-waiting-for-deployment:content.windowsZip64Bit') },
    { key: 'win32', label: t('in-waiting-for-deployment:content.windowsZip32Bit') },
    { key: 'win64offline', label: t('in-waiting-for-deployment:content.windowsZip64BitStatic') },
    { key: 'win32offline', label: t('in-waiting-for-deployment:content.windowsZip32BitStatic') }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.azulZuluJdk8Preferred'),
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
