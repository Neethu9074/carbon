/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment, useState } from 'react';

import {
  Bash,
  Description,
  Dockerfile,
  DropDown,
  HelpBox,
  Input,
  Row,
  Script,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-components/layout/Grid';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function AwsFargateContent({ agentKey, serverlessEndpoint }) {
  const runtimeOptions = [
    t('in-waiting-for-deployment:runtime.go'),
    t('in-waiting-for-deployment:runtime.java'),
    t('in-waiting-for-deployment:runtime.dotnet'),
    t('in-waiting-for-deployment:runtime.nodejs'),
    t('in-waiting-for-deployment:runtime.python'),
    t('in-waiting-for-deployment:runtime.ruby')
  ];
  const baseImageOptions = [
    t('in-waiting-for-deployment:baseImg.glibcLinux'),
    t('in-waiting-for-deployment:baseImg.glibcLinux')
  ];

  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);
  const [baseImageName, setBaseImageName] = useState(baseImageOptions[0]);
  const [appDirName, setAppDirName] = useState('/app');

  let steps;

  if (selectedRuntime === runtimeOptions[0]) {
    steps = (
      <Fragment>
        <Spacer />

        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theSupportForGoOnFargateOnEcsWorksTheSameWayAsWithAnyGoApplicationFollowTheInstructionsOfThe'
          )}
          linkText={t('in-waiting-for-deployment:content.goDocumentation')}
          href="https://instana.com/docs/ecosystem/go"
        />
        <Spacer />
        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <GridRow>
          <Col xs={6}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={6}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[1]) {
    steps = (
      <Fragment>
        <Spacer />

        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.addTheFollowingLinesToYourDockerFileBeforeTheEntrypointOrTheLastCmdCommand'
            )
          ]}
        />
        <Dockerfile
          lines={[
            'FROM <base-image> # This is the *last* FROM clause in your Dockerfile',
            '',
            `COPY --from=containers.instana.${instanaDomain}/instana/release/aws/fargate/jvm /instana /instana`,
            'ENV JAVA_TOOL_OPTIONS="-javaagent:/instana/instana-fargate-collector.jar"',
            '',
            '# Other stuff in your Docker image'
          ]}
        />

        <Spacer />

        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.theDockerBuildProcessNeedsToLogIntoContainersInstanaIoUsingTheFollowingCredentials'
            )
          ]}
        />
        <Bash lines={[`docker login containers.instana.${instanaDomain} --username _ --password ${agentKey}`]} />

        <Spacer />

        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <GridRow>
          <Col xs={6}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={6}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[2]) {
    steps = (
      <Fragment>
        <Spacer />
        {t('in-waiting-for-deployment:content.linuxBaseImage')} &nbsp;
        <DropDown value={baseImageName} options={baseImageOptions} onChange={setBaseImageName} />
        <Spacer />
        <Bash
          lines={[
            `dotnet add <project_name>.csproj package Instana.Tracing.Core.Rewriter.${
              baseImageName == baseImageOptions[0] ? 'Linux' : 'Alpine'
            }`
          ]}
        />
        <Spacer />
        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <Spacer />
        {t(
          'in-waiting-for-deployment:content.yourApplicationDirectoryInTheContainerYouUsuallySetThisAsTheWorkdirDirectoryInTheDockerfile'
        )}
        <Spacer />
        <Input
          id="app-dir"
          value={appDirName}
          onChange={setAppDirName}
          placeholder={t('in-waiting-for-deployment:content.applicationDirectory')}
        />
        <GridRow>
          <Col xs={4}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={4}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
          <Col xs={4}>
            <Description lines={['DOTNET_STARTUP_HOOKS']} />
            <Script lines={[`${appDirName}/Instana.Tracing.Core.dll`]} />
          </Col>
          <Col xs={4}>
            <Description lines={['CORECLR_ENABLE_PROFILING']} />
            <Script lines={['1']} />
          </Col>
          <Col xs={4}>
            <Description lines={['CORECLR_PROFILER']} />
            <Script lines={['{cf0d821e-299b-5307-a3d8-b283c03916dd}']} />
          </Col>
          <Col xs={4}>
            <Description lines={['CORECLR_PROFILER_PATH']} />
            <Script lines={[`${appDirName}/instana_tracing/CoreProfiler.so`]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[3]) {
    steps = (
      <Fragment>
        <Spacer />

        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.addTheFollowingLinesToYourDockerFileBeforeTheEntrypointOrTheLastCmdCommand'
            )
          ]}
        />
        <Dockerfile
          lines={[
            'FROM <base-image> # This is the *last* FROM clause in your Dockerfile',
            '',
            'COPY --from=instana/aws-fargate-nodejs:latest /instana /instana',
            'RUN /instana/setup.sh',
            'ENV NODE_OPTIONS="--require /instana/node_modules/@instana/aws-fargate"',
            '',
            '# Other stuff in your Docker image'
          ]}
        />

        <Spacer />

        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <GridRow>
          <Col xs={6}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={6}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[4]) {
    steps = (
      <Fragment>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theSupportForPythonOnFargateOnEcsWorksTheSameWayAsWithAnyPythonApplicationFollowTheInstructionsOfThe'
          )}
          linkText={t('in-waiting-for-deployment:content.pythonDocumentation')}
          href="https://instana.com/docs/ecosystem/python"
        />
        <Spacer />
        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <GridRow>
          <Col xs={6}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={6}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[5]) {
    steps = (
      <Fragment>
        <Spacer />

        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theSupportForRubyOnFargateOnEcsWorksTheSameWayAsWithAnyRubyApplicationFollowTheInstructionsOfThe'
          )}
          linkText={t('in-waiting-for-deployment:content.rubyDocumentation')}
          href="https://instana.com/docs/ecosystem/ruby"
        />
        <Spacer />
        <Description
          lines={[t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEcsTaskDefinition')]}
        />
        <GridRow>
          <Col xs={6}>
            <Description lines={['INSTANA_ENDPOINT_URL']} />
            <Script lines={[serverlessEndpoint]} />
          </Col>
          <Col xs={6}>
            <Description lines={['INSTANA_AGENT_KEY']} />
            <Script lines={[agentKey]} />
          </Col>
        </GridRow>
      </Fragment>
    );
  }

  return (
    <>
      <HelpBox>
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.supportForAwsFargateIsDesignedToWorkWithAwsFargateOnTheElasticContainerServiceEcs'
            )
          ]}
        />
      </HelpBox>

      <Spacer />

      <Row>
        {t('in-waiting-for-deployment:content.selectYourApplicationRuntime')}
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <Spacer />

      {steps}
    </>
  );
}
