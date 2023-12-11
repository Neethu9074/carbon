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

export function GoPythonRuntimeContent({ type, agentEndpoint, agentKey, agentEndpointPort }: Props): JSX.Element {
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
          label={t('in-plg:agentDetails.aws.instanaEndpointUrl')}
          value={<InputWithButton type="copy" inputValue={agentEndpoint + ':' + agentEndpointPort} />}
          withGap
        />
        <KeyValue
          label={t('in-plg:agentDetails.common.agentKey')}
          value={<InputWithButton type="copy" inputValue={agentKey} />}
          withGap
        />
      </Stack>
    </LayoutSection>
  );
}
