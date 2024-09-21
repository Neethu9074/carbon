/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import ExpandableCardPlg from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function AwsEc2Linux({
  agentKey,
  downloadKey,
  azulDisabled = false,
  agentEndpoint,
  instanaDomain,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[azulDisabled ? 1 : 0]);

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack direction="vertical" gap="small">
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

  function getAgentPackaging() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-plg:agentDetails.agentMode.dynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => setAgentMode(agentModeOptions[0])}
          size="default"
        />
        <RadioButton
          label={t('in-plg:agentDetails.agentMode.static')}
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
          label={t('in-plg:agentDetails.jvmVendor.azulZulu11')}
          checked={jvmVendor === jvmVendorOptions[0]}
          onChange={() => setJVMVendor(jvmVendorOptions[0])}
          size="default"
          disabled={azulDisabled}
        />
        <RadioButton
          label={t('in-plg:agentDetails.jvmVendor.eclipseOpenJD11')}
          checked={jvmVendor === jvmVendorOptions[1]}
          onChange={() => setJVMVendor(jvmVendorOptions[1])}
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

        <LayoutSection
          title={t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectAgentPackagingAndRuntime')}
        >
          <Stack direction="vertical">
            <KeyValue label={t('in-plg:agentDetails.common.packaging')} value={getAgentPackaging()} withGap />
            <KeyValue label={t('in-plg:agentDetails.common.runtime')} value={getRuntime()} withGap />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.useScriptAsUserDataForEc2Instance')}
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

        <GetDeployedAgents agent="ec2%20AND%20linux" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <Typography variant="body-bold">Support</Typography>
        <>
          {sideCardData.map((sideCard, index) => (
            <ExpandableCardPlg
              key={index}
              title={sideCard.title}
              body={sideCard.body}
              openByDefault={sideCard.openByDefault}
            />
          ))}
        </>
      </SidePanel>
    </Container>
  );
}
