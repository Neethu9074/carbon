/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, KeyValue } from '@instana/components';

import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import Props from 'in-plg/pages/onboarding/content/OnboardingProps';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function NodeJsRuntime({ type, agentKey, agentEndpoint, agentEndpointPort }: Props): JSX.Element {
  return (
    <Wrapper>
      <LayoutSection title={t('in-plg:agentDetails.aws.insertLinesToDocker')}>
        <Code
          lang="bash"
          code={[
            '# Dockerfile',
            ' ',
            'FROM <base-image> # This is the *last* FROM clause in your Dockerfile',
            ' ',
            'COPY --from=icr.io/instana/aws-fargate-nodejs:latest /instana /instana',
            'RUN /instana/setup.sh',
            'ENV NODE_OPTIONS="--require /instana/node_modules/@instana/aws-fargate"',
            '',
            '# Other stuff in your Docker image'
          ]}
        />
      </LayoutSection>

      <LayoutSection
        title={
          type == 'gcp'
            ? t('in-plg:agentDetails.aws.step3') + t('in-plg:agentDetails.gcp.setEnvVariablesInCloudRunServiceRevision')
            : t('in-plg:agentDetails.aws.step3') + t('in-plg:agentDetails.aws.setEnvVariablesInECSTaskDefinition')
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
    </Wrapper>
  );
}
