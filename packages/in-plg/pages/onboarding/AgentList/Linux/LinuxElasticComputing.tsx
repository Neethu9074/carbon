/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

const agentModeOptions = ['dynamic', 'static'];
const jvmVendorOptions = ['azul', 'eclipse'];

interface PackagingProps {
  agentMode: string;
  setAgentMode: React.Dispatch<React.SetStateAction<string>>;
}

function Packaging({ agentMode, setAgentMode }: PackagingProps) {
  return (
    <Stack direction="horizontal">
      <RadioButton
        label={t('in-plg:agentDetails.linux.linux_ec2.dynamic')}
        checked={agentMode === agentModeOptions[0]}
        onChange={() => setAgentMode(agentModeOptions[0])}
        size="default"
      />
      <RadioButton
        label={t('in-plg:agentDetails.linux.linux_ec2.static')}
        checked={agentMode === agentModeOptions[1]}
        onChange={() => setAgentMode(agentModeOptions[1])}
        size="default"
      />
    </Stack>
  );
}

interface RuntimeProps {
  jvmVendor: string;
  setJVMVendor: React.Dispatch<React.SetStateAction<string>>;
}

function Runtime({ jvmVendor, setJVMVendor }: RuntimeProps) {
  return (
    <Stack direction="horizontal">
      <RadioButton
        label={t('in-plg:agentDetails.linux.linux_ec2.azulZulu')}
        checked={jvmVendor === jvmVendorOptions[0]}
        onChange={() => setJVMVendor(jvmVendorOptions[0])}
        size="default"
      />
      <RadioButton
        label={t('in-plg:agentDetails.linux.linux_ec2.eclipseOpenJ9')}
        checked={jvmVendor === jvmVendorOptions[1]}
        onChange={() => setJVMVendor(jvmVendorOptions[1])}
        size="default"
      />
    </Stack>
  );
}

export default function LinuxElasticComputing({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  azulDisabled = false,
  fromOnboarding
}: OnboardingProps) {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[azulDisabled ? 1 : 0]);

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
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_ec2.installagentOnAWSEC2')}
            href="https://ibm.biz/insta-agent-linuxawsec2"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_ec2.RuncommandsonAWSES2')}
            href="https://ibm.biz/insta-awsec2-userdata"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_ec2.configurationParameters')}
            href="https://ibm.biz/insta-agent-linuxparams"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  if (shareAndInviteEnabled) sideCardData.pop();

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_ec2.selectTheAgentPackagingMode')}>
          <Stack>
            <KeyValue
              label={t('in-plg:agentDetails.linux.linux_ec2.Packaging')}
              value={Packaging({ agentMode, setAgentMode })}
              withGap
            />
            <KeyValue
              label={t('in-plg:agentDetails.linux.linux_ec2.runtime')}
              value={Runtime({ jvmVendor, setJVMVendor })}
              withGap
            />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.linux.linux_ec2.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}
        >
          <Code
            lang="bash"
            code={[
              `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -d ${downloadKey} -t ${
                agentMode === 'dynamic' ? 'dynamic' : 'static'
              } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'}`
            ]}
          />
        </LayoutSection>
        <GetDeployedAgents agent="linux" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
