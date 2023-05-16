/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc. 2023
 */

import React, { useState } from 'react';

import {
  DownloadButton,
  DropDown,
  getAgentDownloadURL,
  HelpBox,
  TextWithLink,
  Row
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { t } from 'in-i18n';

export default function ManualIBMAceTracingContent({ butlerDomain, agentKey, downloadKey, tenant, tenantUnit }) {
  const agentOptions = [{ key: 'ibmace-tracing', label: t('in-waiting-for-deployment:content.ibmAceTracingUserExit') }];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, downloadKey, option, butlerDomain)} />
      </Row>
      <HelpBox>
        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.forMoreInformationVisitTheIBMAceTracing"
          href="https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-app-connect-enterprise-ace#tracing"
        />
      </HelpBox>
    </>
  );
}
