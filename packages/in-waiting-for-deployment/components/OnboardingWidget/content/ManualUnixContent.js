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

export default function ManualUnixContent({ agentKey, butlerDomain, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'sparc64', label: t('in-waiting-for-deployment:content.solaris64BitSparc') },
    { key: 'sparc64Static', label: t('in-waiting-for-deployment:content.solaris64BitSparcStatic') },
    { key: 'sparc32', label: t('in-waiting-for-deployment:content.solaris32BitSparc') },
    { key: 'sparc32Static', label: t('in-waiting-for-deployment:content.solaris32BitSparcStatic') },
    { key: 'aix64', label: t('in-waiting-for-deployment:content.aix64BitPowerPc') },
    { key: 'aix64Static', label: t('in-waiting-for-deployment:content.aix64BitPowerPcStatic') },
    { key: 'aix32', label: t('in-waiting-for-deployment:content.aix32BitPowerPc') },
    { key: 'aix32Static', label: t('in-waiting-for-deployment:content.aix32BitPowerPcStatic') }
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
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost'),
            t(
              'in-waiting-for-deployment:content.toExtractMakeSureToUseAGnuTarThatIsCapableOfExtractingPathsLongerThan100Characters'
            )
          ]}
        />
      </HelpBox>
    </>
  );
}
