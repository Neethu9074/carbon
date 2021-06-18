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

export default function ManualIBMApmContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [{ key: 'ibmapm-proxy', label: t('in-waiting-for-deployment:content.ibmapmproxy') }];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresRuntimeDropin')}>
        <Listing items={[t('in-waiting-for-deployment:content.ibmapmmineba')]} />
        <Spacer />
        <Description lines={[t('in-waiting-for-deployment:content.copyToApmMinDropins')]} />
      </HelpBox>
    </>
  );
}
