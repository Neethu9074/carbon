/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue, Stack } from '@instana/components';

import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import Props from 'in-plg/pages/onboarding/content/OnboardingProps';
import { t } from 'in-i18n';

export function PhpRuntimeContent({ type, agentKey, serverlessEndpoint }: Props): JSX.Element {
  return (
    <LayoutSection
      title={
        type == 'gcp'
          ? t('in-plg:agentDetails.gcp.integrateInstanaInProcessCollectorForGoogle')
          : t('in-plg:agentDetails.aws.reviewPrerequisiteAndSetEnvVariableEcs')
      }
    >
      <Stack direction="horizontal">
        <KeyValue
          label={'INSTANA_ENDPOINT_URL'}
          value={<InputWithButton type="copy" inputValue={serverlessEndpoint} />}
          withGap
        />
        <KeyValue label={'INSTANA_AGENT_KEY'} value={<InputWithButton type="copy" inputValue={agentKey} />} withGap />
      </Stack>
    </LayoutSection>
  );
}
