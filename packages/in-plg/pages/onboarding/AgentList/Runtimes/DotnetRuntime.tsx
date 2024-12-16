/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import Props from 'in-plg/pages/onboarding/content/OnboardingProps';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import Code from 'in-plg/components/Code/Code';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

export default function DotnetRuntime({ type, agentKey, serverlessEndpoint }: Props): JSX.Element {
  const imageOptions = [
    t('in-plg:agentDetails.aws.imageOptions.linuxGlibcBased'),
    t('in-plg:agentDetails.aws.imageOptions.alpineLinuxMuslBased')
  ];
  const [baseImage, setBaseImage] = useState(imageOptions[0]);
  const [applicationDirectory, setApplicationDirectory] = useState('/app');

  function installationMethod() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={imageOptions[0]}
          checked={baseImage === imageOptions[0]}
          onChange={() => setBaseImage(imageOptions[0])}
          size="default"
        />
        <RadioButton
          label={imageOptions[1]}
          checked={baseImage === imageOptions[1]}
          onChange={() => setBaseImage(imageOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  return (
    <Wrapper>
      <LayoutSection
        title={
          type == 'gcp'
            ? t('in-plg:agentDetails.gcp.integrateInstanaInProcessCollectorForGoogle')
            : t('in-plg:agentDetails.aws.integrateInstanaInProcessCollectorForAws')
        }
      >
        <Stack>
          <KeyValue label={t('in-plg:agentDetails.aws.installationMethod')} value={installationMethod()} withGap />
          <Code
            lang="bash"
            code={[
              `dotnet add <project_name>.csproj package Instana.Tracing.Core.Rewriter.${
                baseImage === imageOptions[0] ? 'Linux' : 'Alpine'
              }`
            ]}
          />
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={
          type == 'gcp'
            ? t('in-plg:agentDetails.gcp.setEnvironmentVariablesCloudRunServiceDefinition')
            : t('in-plg:agentDetails.aws.setEnvironmentVariablesInECSTaskDefinition')
        }
      >
        <Wrapper>
          <Stack>
            <KeyValue
              label={t('in-plg:agentDetails.aws.applicationDirectory')}
              value={
                <Input
                  defaultValue={applicationDirectory}
                  placeholder={t('in-waiting-for-deployment:content.applicationDirectory')}
                  onChange={e => setApplicationDirectory(e.target.value)}
                />
              }
              withGap
            />
            <Typography variant="body-regular">{t('in-plg:agentDetails.aws.workDirDirectoryInDocker')}</Typography>
          </Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={'INSTANA_ENDPOINT_URL'}
              value={<InputWithButton inputValue={serverlessEndpoint} type="copy" />}
              withGap
            />
            <KeyValue
              label={'INSTANA_AGENT_KEY'}
              value={<InputWithButton inputValue={agentKey} type="copy" />}
              withGap
            />
          </Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={'DOTNET_STARTUP_HOOKS'}
              value={<InputWithButton inputValue={`${applicationDirectory}/Instana.Tracing.Core.dll`} type="copy" />}
              withGap
            />
            <KeyValue
              label={'CORECLR_ENABLE_PROFILING'}
              value={<InputWithButton inputValue={'1'} type="copy" />}
              withGap
            />
          </Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={'CORECLR_PROFILER'}
              value={<InputWithButton inputValue={'{cf0d821e-299b-5307-a3d8-b283c03916dd}'} type="copy" />}
              withGap
            />
            <KeyValue
              label={'CORECLR_PROFILER_PATH'}
              value={
                <InputWithButton inputValue={`${applicationDirectory}/instana_tracing/CoreProfiler.so`} type="copy" />
              }
              withGap
            />
          </Stack>
        </Wrapper>
      </LayoutSection>
    </Wrapper>
  );
}
