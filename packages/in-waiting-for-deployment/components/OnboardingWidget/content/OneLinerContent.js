/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment, useState } from 'react';

import {
  Bash,
  CheckBox,
  HelpBox,
  Listing,
  Row,
  Spacer
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

export default function OneLinerContent({ agentKey, agentEndpoint, agentEndpointPort, azulDisabled = false }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[azulDisabled ? 1 : 0]);

  const installModeOptions = ['interactive', 'silent'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const [isService, setIsService] = useState(false);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
              disabled={azulDisabled}
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentInstallationModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentInstallationModeInteractive')}
              checked={installMode === installModeOptions[0]}
              onChange={() => setInstallMode(installModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentInstallationModeSilent')}
              checked={installMode === installModeOptions[1]}
              onChange={() => setInstallMode(installModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <CheckBox
        label={t('in-waiting-for-deployment:content.installAndStartAsServiceOnlySupportedForSystemDBasedSystems')}
        checked={isService}
        setChecked={setIsService}
      />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'} ${
            installMode === installModeOptions[0] ? '' : '-y'
          } ${isService ? '-s' : ''}
          `
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedOperatingSystems')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.ubuntuLinux1404160418042004'),
            t('in-waiting-for-deployment:content.centOs678'),
            t('in-waiting-for-deployment:content.debian910'),
            t('in-waiting-for-deployment:content.suseLinuxEnterpriseServerSles12'),
            t('in-waiting-for-deployment:content.redhatEnterpriseLinuxRhel678'),
            t('in-waiting-for-deployment:content.amazonLinux12')
          ]}
        />
      </HelpBox>
    </>
  );
}
