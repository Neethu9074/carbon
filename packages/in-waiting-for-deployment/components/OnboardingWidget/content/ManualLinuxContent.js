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

export default function ManualLinuxContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'linux64', label: t('in-waiting-for-deployment:content.linux64Bit') },
    { key: 'linux64Static', label: t('in-waiting-for-deployment:content.linux64BitStatic') },
    { key: 'linux32', label: t('in-waiting-for-deployment:content.linux32Bit') },
    { key: 'linux32Static', label: t('in-waiting-for-deployment:content.linux32BitStatic') },
    { key: 'linuxarm64', label: t('in-waiting-for-deployment:content.linux64BitArm') },
    { key: 'linuxarm64Static', label: t('in-waiting-for-deployment:content.linux64BitArmStatic') },
    { key: 'linuxarm32', label: t('in-waiting-for-deployment:content.linux32BitArm') },
    { key: 'linuxarm32Static', label: t('in-waiting-for-deployment:content.linux32BitArmStatic') },
    { key: 'linuxppc64', label: t('in-waiting-for-deployment:content.linux64BitPowerPc') },
    { key: 'linuxppc64Static', label: t('in-waiting-for-deployment:content.linux64BitPowerPcStatic') },
    { key: 'linuxppc32', label: t('in-waiting-for-deployment:content.linux32BitPowerPc') },
    { key: 'linuxppc32Static', label: t('in-waiting-for-deployment:content.linux32BitPowerPcStatic') },
    { key: 'linuxppcle64', label: t('in-waiting-for-deployment:content.linux64BitPowerPcLittleEndian') },
    { key: 'linuxppcle64Static', label: t('in-waiting-for-deployment:content.linux64BitPowerPcLittleEndianStatic') },
    { key: 'linuxs390x', label: t('in-waiting-for-deployment:content.linuxS390X') },
    { key: 'linuxs390xStatic', label: t('in-waiting-for-deployment:content.linuxS390XStatic') }
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
