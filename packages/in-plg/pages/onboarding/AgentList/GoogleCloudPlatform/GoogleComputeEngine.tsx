/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface Option {
  key: string;
  label: string;
}

export default function GoogleComputeEngine({
  instanaDomain,
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort
}: OnboardingProps): JSX.Element {
  const packagingOptions: Option[] = [
    { key: 'Dynamic', label: t('in-plg:agentDetails.agentMode.dynamic') },
    { key: 'Static', label: t('in-plg:agentDetails.agentMode.static') }
  ];
  const jvmVendorOptions: Option[] = [
    { key: 'AzulZulu18', label: t('in-plg:agentDetails.jvmVendor.azulZulu18') },
    { key: 'EclipseOpenJD11', label: t('in-plg:agentDetails.jvmVendor.eclipseOpenJD11') }
  ];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);
  const [packagingMode, setPackagingMode] = useState(packagingOptions[0]);

  const supportViewData = [
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
          <DocumentLink text={t('in-plg:agentDetails.aws.documentationLinks.runningStartupScript')} href="" />
          <DocumentLink text={t('in-plg:agentDetails.aws.documentationLinks.uninstallingTheHostAgent')} href="" />
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

  function packaging() {
    return (
      <Stack direction="horizontal">
        <CheckboxFancy
          label={packagingOptions[0].label}
          checked={packagingMode.key === packagingOptions[0].key}
          onChange={() => setPackagingMode(packagingOptions[0])}
          size="default"
          asRadioButton
        />
        <CheckboxFancy
          label={packagingOptions[1].label}
          checked={packagingMode.key === packagingOptions[1].key}
          onChange={() => setPackagingMode(packagingOptions[1])}
          size="default"
          asRadioButton
        />
      </Stack>
    );
  }

  function getRuntime() {
    return (
      <Stack direction="horizontal">
        <CheckboxFancy
          label={jvmVendorOptions[0].label}
          checked={jvmVendor.key === jvmVendorOptions[0].key}
          onChange={() => setJVMVendor(jvmVendorOptions[0])}
          size="default"
          asRadioButton
        />
        <CheckboxFancy
          label={jvmVendorOptions[1].label}
          checked={jvmVendor.key === jvmVendorOptions[1].key}
          onChange={() => setJVMVendor(jvmVendorOptions[1])}
          size="default"
          asRadioButton
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

        <LayoutSection title={t('in-plg:agentDetails.gcp.selectAgentPackagingMode')}>
          <Stack>
            <KeyValue label={t('in-plg:agentDetails.common.packaging')} value={packaging()} withGap />
            <KeyValue label={t('in-plg:agentDetails.common.runtime')} value={getRuntime()} withGap />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.gcp.useScript')}>
          <Code
            lang="bash"
            code={[
              `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && sudo apt-get install apt-transport-https ca-certificates && sudo ./setup_agent.sh -a ${agentKey} -d ${downloadKey} -t ${
                packagingMode.key === packagingOptions[0].key
                  ? packagingOptions[0].key.toLowerCase()
                  : packagingOptions[1].key.toLowerCase()
              } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor.key === jvmVendorOptions[0].key ? '' : '-j'}`
            ]}
          />
        </LayoutSection>

        <GetDeployedAgents agent="gce" />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
}
