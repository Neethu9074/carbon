/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  Description,
  DropDown,
  HelpBox,
  PowershellEC2,
  Row,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function ElasticComputingWindowsContent({
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  tenant,
  tenantUnit
}) {
  const agentModeOptions = [
    t('in-waiting-for-deployment:content.dynamicAgent'),
    t('in-waiting-for-deployment:content.staticAgent')
  ];
  const [agentMode, setMode] = useState(agentModeOptions[0]);

  return (
    <>
      <Row>
        <DropDown value={agentMode} options={agentModeOptions} onChange={setMode} />
      </Row>
      <Spacer />
      <Description lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsUserDataForTheEc2Instance')]} />
      <PowershellEC2
        lines={[
          `Invoke-WebRequest -OutFile "$env:TEMP\\AgentBootstrap.exe" -Uri "https://instana.${instanaDomain}/assets/agent/${tenant}/${tenantUnit}?agentKey=${agentKey}&type=exe64${
            agentMode === agentModeOptions[0] ? '' : 'offline'
          }"`,
          `Invoke-Expression -Command "$env:TEMP\\AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} /quiet"`
        ]}
      />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.theUserDataScriptAboveWillDownloadTheHostAgentInstallItOnTheVirtualMachineAsAWindowsServiceAndThenAutomaticallyStartIt'
          )
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.userDataInAwsEc2')}>
        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveWithUserDataInAwsEc2ReferToTheWindows"
          href="https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-windows-user-data.html#user-data-scripts"
        />
      </HelpBox>
    </>
  );
}
