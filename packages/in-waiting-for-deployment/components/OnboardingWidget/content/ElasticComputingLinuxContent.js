/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { RadioButton } from '@instana/components';

import {
  Bash,
  Description,
  HelpBox,
  Row,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function ElasticComputingLinuxContent({ agentKey, downloadKey, agentEndpoint, agentEndpointPort }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <RadioButton
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
            />
          </p>
          <p>
            <RadioButton
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
            />
          </p>
        </>

        <>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <RadioButton
              label="Azul Zulu 11"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
            />
          </p>
          <p>
            <RadioButton
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
            />
          </p>
        </>
      </Row>
      <Description lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsUserDataForTheEc2Instance')]} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -d ${downloadKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'}`
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.userDataInAwsEc2')}>
        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveWithUserDataInAwsEc2ReferToTheLinux"
          href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
        />
      </HelpBox>
    </>
  );
}
