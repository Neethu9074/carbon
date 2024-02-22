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

export default function JavaRuntimeContent({ type, agentKey, downloadKey, instanaDomain, serverlessEndpoint }: Props) {
  const username = '_';
  return (
    <Wrapper>
      <LayoutSection title={t('in-plg:agentDetails.aws.insertLinesToDocker')}>
        <Code
          lang="bash"
          withCopy
          code={[
            'FROM <base-image> # This is the *last* FROM clause in your Dockerfile',
            '',
            `COPY --from=containers.instana.${instanaDomain}/instana/release/aws/fargate/jvm /instana /instana`,
            'ENV JAVA_TOOL_OPTIONS="-javaagent:/instana/instana-fargate-collector.jar"',
            '',
            '# Other stuff in your Docker image'
          ]}
        />
      </LayoutSection>

      <LayoutSection title={t('in-plg:agentDetails.aws.initiateDockerBuildProcess')}>
        <Stack>
          <Code
            lang="bash"
            code={[`docker login containers.instana.${instanaDomain} --username ${username} --password ${downloadKey}`]}
          />
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.aws.username')}
              value={<InputWithButton type="copy" inputValue={username} />}
              withGap
            />
            <KeyValue
              label={t('in-plg:agentDetails.aws.password')}
              value={<InputWithButton type="copy" inputValue={agentKey} />}
              withGap
            />
          </Stack>
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.aws.step4') + t('in-plg:agentDetails.aws.setEnvVariablesInECSTaskDefinition')}
      >
        <Stack direction={type === 'gcp' ? 'horizontal' : 'vertical'}>
          <KeyValue
            label={'INSTANA_ENDPOINT_URL'}
            value={<InputWithButton type="copy" inputValue={serverlessEndpoint} />}
            withGap
          />
          <KeyValue label={'INSTANA_AGENT_KEY'} value={<InputWithButton type="copy" inputValue={agentKey} />} withGap />
        </Stack>
      </LayoutSection>
    </Wrapper>
  );
}
