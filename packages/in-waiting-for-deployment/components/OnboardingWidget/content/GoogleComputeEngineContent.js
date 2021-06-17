/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment, useState } from 'react';

import {
  Bash,
  Description,
  HelpBox,
  Row,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

export default function GoogleComputeEngineContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentMode')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.dynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.static')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentJdk')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.azulZulu18')}
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.eclipseOpenJ911')}
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <Description
        lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsStartupScriptForTheGceInstance')]}
      />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo apt-get install apt-transport-https ca-certificates && sudo ./setup_agent.sh -a ${agentKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'}`
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.startupScriptsInGoogleComputeEngine')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveAsAStartupScriptInGceReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.runningStartupScriptsPage')}
          href="https://cloud.google.com/compute/docs/startupscript"
        />
      </HelpBox>
    </>
  );
}
