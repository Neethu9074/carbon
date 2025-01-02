/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { CheckBox } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function LinuxAutomatic({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  azulDisabled = false,
  fromOnboarding
}: OnboardingProps) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[azulDisabled ? 1 : 0]);

  const installModeOptions = ['interactive', 'silent'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const [isService, setIsService] = useState(false);

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_auto.installAnAgentOnLinux')}
            href="https://ibm.biz/insta-agent-linux1line"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_auto.configurationParameters')}
            href="https://ibm.biz/insta-agent-linuxparams"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_auto.troubleshootingInstallation')}
            href="https://ibm.biz/insta-agent1probs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_auto.runningTheAgent')}
            href="https://ibm.biz/insta-agent-linux1run"
          />
        </>
      ),
      openByDefault: true
    }
  ];

  function getPackaging() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentModeDynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => setAgentMode(agentModeOptions[0])}
          size="default"
        />
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentModeStatic')}
          checked={agentMode === agentModeOptions[1]}
          onChange={() => setAgentMode(agentModeOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  function getRuntime() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label="Azul Zulu 11"
          checked={jvmVendor === jvmVendorOptions[0]}
          onChange={() => setJVMVendor(jvmVendorOptions[0])}
          size="default"
          disabled={azulDisabled}
        />
        <RadioButton
          label="Eclipse OpenJ9 11"
          checked={jvmVendor === jvmVendorOptions[1]}
          onChange={() => setJVMVendor(jvmVendorOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  function getInstallationMode() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentInstallationModeInteractive')}
          checked={installMode === installModeOptions[0]}
          onChange={() => setInstallMode(installModeOptions[0])}
          size="default"
        />
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentInstallationModeSilent')}
          checked={installMode === installModeOptions[1]}
          onChange={() => setInstallMode(installModeOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_ec2_64.selectTheAgentPackagingMode')}>
          <Stack>
            <KeyValue label={t('in-plg:agentDetails.linux.linux_ec2.Packaging')} value={getPackaging()} withGap />
            <KeyValue label={t('in-plg:agentDetails.linux.linux_ec2.runtime')} value={getRuntime()} withGap />
            <KeyValue label={t('in-plg:agentDetails.linux.linux_ec2.runtime')} value={getInstallationMode()} withGap />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.linux.linux_ec2.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}
        >
          <Stack>
            <CheckBox
              label={t('in-waiting-for-deployment:content.installAndStartAsServiceOnlySupportedForSystemDBasedSystems')}
              checked={isService}
              setChecked={setIsService}
            />
            <Code
              lang="bash"
              code={[
                `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -d ${downloadKey} -t ${
                  agentMode === 'dynamic' ? 'dynamic' : 'static'
                } -e ${agentEndpoint}:${agentEndpointPort} ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'} ${
                  installMode === installModeOptions[0] ? '' : '-y'
                } ${isService ? '-s' : ''}`
              ]}
            />
          </Stack>
        </LayoutSection>
        <GetDeployedAgents agent="linux" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
