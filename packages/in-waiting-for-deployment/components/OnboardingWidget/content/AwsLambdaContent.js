/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  Bash,
  Description,
  DropDown,
  HelpBox,
  Input,
  Listing,
  Row,
  Script,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import createObservable from 'in-services/http/observableHttpResult';
import { Col, Row as GridRow } from 'in-components/layout/Grid';
import http from 'in-services/http';
import { t, Trans } from 'in-i18n';

const lambdaLayerVersionApiBaseUrl = `https://lambda-layers.instana.${instanaDomain}`;

export default function AwsLambdaContent({ agentKey, serverlessEndpoint }) {
  const runtimeOptions = [
    t('in-waiting-for-deployment:runtime.go'),
    t('in-waiting-for-deployment:runtime.java'),
    t('in-waiting-for-deployment:runtime.nodejs10Plus'),
    t('in-waiting-for-deployment:runtime.nodejs8'),
    t('in-waiting-for-deployment:runtime.python2and3'),
    t('in-waiting-for-deployment:runtime.ruby')
  ];
  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);
  const awsRegionOptions = [
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ca-central-1',
    'eu-central-1',
    'eu-north-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'sa-east-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2'
  ];
  const [awsRegion, setAwsRegion] = useState(awsRegionOptions[6]);
  const [lambdaFunctionName, setLambdaFunctionName] = useState('my-lambda-function');
  const [lambdaHandler, setHandler] = useState('index.handler');

  let steps;

  const nodejsLayerVersionFallback = '71';
  const nodejsLayerArn = useLambdaLayerVersionObservable('instana-nodejs', nodejsLayerVersionFallback);
  const pythonLayerVersion = '27';
  const pythonLayerArn = useLambdaLayerVersionObservable('instana-python', pythonLayerVersion);
  const javaLayerVersion = '25';
  const javaLayerArn = useLambdaLayerVersionObservable('instana-java', javaLayerVersion);

  if (selectedRuntime === runtimeOptions[0]) {
    // Golang
    steps = (
      <>
        <Spacer />

        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.awsLambdaFunctionsWrittenInGoNeedToBeManuallyInstrumentedInOrderToCollectTraceDataFollowTheInstructionsOfThe"
          href="https://instana.com/docs/ecosystem/aws-lambda/go"
        />
        <Spacer />
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEnvironmentVariablesSectionAtAwsLambdaConfigurationPage'
            )
          ]}
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
      </>
    );
  } else if (selectedRuntime === runtimeOptions[1]) {
    // Java
    steps = (
      <>
        <HelpBox title={t('in-waiting-for-deployment:content.configuringYourAwsLambdaFunction')}>
          <Description
            lines={[
              <Trans
                key="0"
                i18nKey="in-waiting-for-deployment:content.noteThatTheJava8RuntimeIsNotSupportedCurrentlyOnlySupportedRuntimesAreJava8A12AndJava11"
              />
            ]}
          />
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.thePreferredWayToConfigureAwsLambdaFunctionsBasedOnJavaForTracingIsTheInstanaLambdaLayerWithAutoTrace'
              ),
              t('in-waiting-for-deployment:content.thereANumberOfWaysToConfigureThis')
            ]}
          />
          <Listing
            items={[
              t('in-waiting-for-deployment:content.awsWebConsole'),
              t('in-waiting-for-deployment:content.awsCommandLineInterface'),
              t('in-waiting-for-deployment:content.awsServerlessApplicationModelAwsSam'),
              t('in-waiting-for-deployment:content.yourPreferredToolToManageAwsLambdaFunctions')
            ]}
          />
        </HelpBox>
        <Spacer />
        <HelpBox title={t('in-waiting-for-deployment:content.awsWebConsole')}>
          <TextWithLink
            i18nKey="in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur"
            href="https://instana.com/docs/ecosystem/aws-lambda/#autotrace-aws-lambdas"
          />
          <Description lines={[t('in-waiting-for-deployment:content.inShortTheStepsAreAsFollows')]} />
          <GridRow>
            <Col xs={4}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
          </GridRow>
          <Spacer />
          <Listing
            items={[
              <>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[javaLayerArn]} />
                (
                <TextWithLink
                  i18nKey="in-waiting-for-deployment:content.seeAwsDocs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )<Spacer />
              </>,
              <>
                <Spacer />
                {t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInYourLambdaFunction')}
                <Spacer />
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
                    <Description lines={['JAVA_TOOL_OPTIONS']} />
                    <Script lines={['-javaagent:/opt/instana/standalone-collector.jar']} />
                  </Col>
                </GridRow>
              </>
            ]}
          />
        </HelpBox>

        <Spacer />

        <HelpBox title={t('in-waiting-for-deployment:content.awsCommandLineInterface')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.toUseTheAwsCommandLineInterfacePleaseProvideTheFollowingValuesAndUseACommandSimilarToTheOneBelow'
              )
            ]}
          />
          <GridRow>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.lambdaFunctionName')}
              <Spacer />
              <Input
                id="lambda-function-name"
                value={lambdaFunctionName}
                onChange={setLambdaFunctionName}
                placeholder={t('in-waiting-for-deployment:content.theNameOfYourLambdaFunction')}
              />
            </Col>
          </GridRow>
          <Bash
            lines={[
              '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
              '# Instead, use this as a template to define your own aws cli command.',
              `aws --region ${awsRegion} lambda update-function-configuration \\`,
              `   --function-name ${lambdaFunctionName} \\`,
              `   --layers ${javaLayerArn} \\`,
              '   --environment "Variables={JAVA_TOOL_OPTIONS=-javaagent:/opt/instana/standalone-collector.jar, ',
              `INSTANA_ENDPOINT_URL=${serverlessEndpoint}, INSTANA_AGENT_KEY=${agentKey} }"`
            ]}
          />
        </HelpBox>
      </>
    );
  } else if (selectedRuntime === runtimeOptions[2]) {
    // Node.js >= 10.x
    steps = (
      <>
        <HelpBox title={t('in-waiting-for-deployment:content.configuringYourAwsLambdaFunction')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.thePreferredWayToConfigureAwsLambdaFunctionsBasedOnNodeJs10XOrNewerForTracingIsTheInstanaLambdaLayerWithAutoTrace'
              ),
              t('in-waiting-for-deployment:content.thereANumberOfWaysToConfigureThis')
            ]}
          />
          <Listing
            items={[
              t('in-waiting-for-deployment:content.awsWebConsole'),
              t('in-waiting-for-deployment:content.awsCommandLineInterface'),
              t('in-waiting-for-deployment:content.awsServerlessApplicationModelAwsSam'),
              t('in-waiting-for-deployment:content.yourPreferredToolToManageAwsLambdaFunctions')
            ]}
          />
        </HelpBox>
        <Spacer />
        <HelpBox title={t('in-waiting-for-deployment:content.awsWebConsole')}>
          <TextWithLink
            i18nKey="in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur"
            href="https://instana.com/docs/ecosystem/aws-lambda/#autotrace-aws-lambdas"
          />
          <Description lines={[t('in-waiting-for-deployment:content.inShortTheStepsAreAsFollows')]} />
          <GridRow>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.currentLambdaHandler')}
              <Spacer />
              <Input
                id="lambda-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder={t('in-waiting-for-deployment:content.yourCurrentLambdaHandler')}
              />
            </Col>
          </GridRow>
          <Spacer />
          <Listing
            items={[
              <>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[nodejsLayerArn]} />
                (
                <TextWithLink
                  i18nKey="in-waiting-for-deployment:content.seeAwsDocs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </>,
              <>
                <Spacer />
                {t('in-waiting-for-deployment:content.setInstanaAutoWrapHandlerAsTheHandlerForYourLambdaFunction')}
                <Spacer />
                <Script lines={['instana-aws-lambda-auto-wrap.handler']} />(
                <TextWithLink
                  i18nKey="in-waiting-for-deployment:content.seeAwsDocs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </>,
              <>
                <Spacer />
                {t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInYourLambdaFunction')}
                <Spacer />
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
                    <Description lines={['LAMBDA_HANDLER']} />
                    <Script lines={[lambdaHandler]} />
                  </Col>
                </GridRow>
              </>
            ]}
          />
        </HelpBox>

        <Spacer />

        <HelpBox title={t('in-waiting-for-deployment:content.awsCommandLineInterface')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.toUseTheAwsCommandLineInterfacePleaseProvideTheFollowingValuesAndUseACommandSimilarToTheOneBelow'
              )
            ]}
          />
          <GridRow>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.lambdaFunctionName')}
              <Spacer />
              <Input
                id="lambda-function-name"
                value={lambdaFunctionName}
                onChange={setLambdaFunctionName}
                placeholder={t('in-waiting-for-deployment:content.theNameOfYourLambdaFunction')}
              />
            </Col>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.currentLambdaHandlerOptional')}
              <Spacer />
              <Input
                id="current-lambda-function-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder={t('in-waiting-for-deployment:content.yourCurrentLambdaHandler')}
              />
            </Col>
          </GridRow>
          <Bash
            lines={[
              '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
              '# Instead, use this as a template to define your own aws cli command.',
              `aws --region ${awsRegion} lambda update-function-configuration \\`,
              `   --function-name ${lambdaFunctionName} \\`,
              `   --layers ${nodejsLayerArn} \\`,
              '   --handler instana-aws-lambda-auto-wrap.handler',
              `   --environment "Variables={${
                lambdaHandler === 'index.handler' ? '' : `LAMBDA_HANLDER=${lambdaHandler}, `
              }INSTANA_ENDPOINT_URL=${serverlessEndpoint}, INSTANA_AGENT_KEY=${agentKey} }"`
            ]}
          />
        </HelpBox>
      </>
    );
  } else if (selectedRuntime === runtimeOptions[3]) {
    // Node.js 8.x
    steps = (
      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.thePreferredWayToConfigureAwsLambdaFunctionsBasedOnNodeJs8XIsToUseThe"
        href="https://instana.com/docs/ecosystem/aws-lambda#manual-wrapping"
      />
    );
  } else if (selectedRuntime === runtimeOptions[4]) {
    // Python
    steps = (
      <>
        <HelpBox title={t('in-waiting-for-deployment:content.configuringYourAwsLambdaFunction')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.thePreferredWayToConfigureAwsLambdaFunctionsBasedOnPythonForTracingIsTheInstanaLambdaLayerWithAutoTrace'
              ),
              t('in-waiting-for-deployment:content.thereANumberOfWaysToConfigureThis')
            ]}
          />
          <Listing
            items={[
              t('in-waiting-for-deployment:content.awsWebConsole'),
              t('in-waiting-for-deployment:content.awsCommandLineInterface'),
              t('in-waiting-for-deployment:content.awsServerlessApplicationModelAwsSam'),
              t('in-waiting-for-deployment:content.yourPreferredToolToManageAwsLambdaFunctions')
            ]}
          />
        </HelpBox>

        <Spacer />

        <HelpBox title={t('in-waiting-for-deployment:content.awsWebConsole')}>
          <TextWithLink
            i18nKey="in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur"
            href="https://instana.com/docs/ecosystem/aws-lambda#instana-autotrace"
          />
          <Description lines={[t('in-waiting-for-deployment:content.inShortTheStepsAreAsFollows')]} />
          <GridRow>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}&nbsp;
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              {t('in-waiting-for-deployment:content.currentLambdaHandler')}&nbsp;
              <Spacer />
              <Input
                id="lambda-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder={t('in-waiting-for-deployment:content.yourCurrentLambdaHandler')}
              />
            </Col>
          </GridRow>
          <Spacer />
          <Listing
            items={[
              <>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[pythonLayerArn]} />
                (
                <TextWithLink
                  i18nKey="in-waiting-for-deployment:content.seeAwsDocs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </>,
              <>
                <Spacer />
                {t('in-waiting-for-deployment:content.setInstanaAutoWrapHandlerAsTheHandlerForYourLambdaFunction')}
                <Spacer />
                <Script lines={['instana.lambda_handler']} />(
                <TextWithLink
                  i18nKey="in-waiting-for-deployment:content.seeAwsDocs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </>,
              <>
                <Spacer />
                {t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInYourLambdaFunction')}
                <Spacer />
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
                    <Description lines={['LAMBDA_HANDLER']} />
                    <Script lines={[lambdaHandler]} />
                  </Col>
                </GridRow>
              </>
            ]}
          />
        </HelpBox>

        <Spacer />

        <HelpBox title={t('in-waiting-for-deployment:content.awsCommandLineInterface')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.toUseTheAwsCommandLineInterfacePleaseProvideTheFollowingValuesAndUseACommandSimilarToTheOneBelow'
              )
            ]}
          />
          <GridRow>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.selectYourAwsRegion')}
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.lambdaFunctionName')}
              <Input
                id="lambda-function-name"
                value={lambdaFunctionName}
                onChange={setLambdaFunctionName}
                placeholder={t('in-waiting-for-deployment:content.theNameOfYourLambdaFunction')}
              />
            </Col>
            <Col xs={3}>
              {t('in-waiting-for-deployment:content.currentLambdaHandlerOptional')}
              <Input
                id="current-lambda-function-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder={t('in-waiting-for-deployment:content.yourCurrentLambdaHandler')}
              />
            </Col>
          </GridRow>
          <Bash
            lines={[
              '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
              '# Instead, use this as a template to define your own aws cli command.',
              `aws --region ${awsRegion} lambda update-function-configuration \\`,
              `   --function-name ${lambdaFunctionName} \\`,
              `   --layers ${pythonLayerArn} \\`,
              '   --handler instana.lambda_handler',
              `   --environment "Variables={${
                lambdaHandler === 'index.handler' ? '' : `LAMBDA_HANLDER=${lambdaHandler}, `
              }INSTANA_ENDPOINT_URL=${serverlessEndpoint}, INSTANA_AGENT_KEY=${agentKey} }"`
            ]}
          />
        </HelpBox>
      </>
    );
  } else if (selectedRuntime === runtimeOptions[5]) {
    // Ruby
    steps = (
      <>
        <Spacer />

        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.awsLambdaFunctionsWrittenInRubyNeedToBeManuallyInstrumentedInOrderToCollectTraceDataFollowTheInstructionsOfThe"
          href="https://instana.com/docs/ecosystem/aws-lambda/ruby"
        />
        <Spacer />
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheEnvironmentVariablesSectionAtAwsLambdaConfigurationPage'
            )
          ]}
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
      </>
    );
  }

  return (
    <>
      <Row>
        {t('in-waiting-for-deployment:content.selectYourLambdaRuntime')}
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.makeSureYouHaveAnInstanaAwsSensorRunningInYourAwsRegionForDetailsOnSettingUpTheInstanaAwsSensorReferToThe"
        href="https://instana.com/docs/ecosystem/aws"
      />
      <Spacer />

      <TextWithLink
        i18nKey="in-waiting-for-deployment:content.nextConfigureYourAwsLambdaFunctionsForNativeTracingAsDescribedInTheStepsBelowOtherOptionsToSetUpNativeLambdaTracingAndMoreDetailsAboutThisFeatureAreAvailableInThe"
        href="https://instana.com/docs/ecosystem/aws-lambda"
      />
      <Spacer />

      {steps}
    </>
  );

  function useLambdaLayerVersionObservable(layerName, fallbackVersion) {
    return (
      useObservable(
        createObservable(
          http({
            url: `${lambdaLayerVersionApiBaseUrl}/${layerName}`,
            method: 'GET',
            queryParams: { region: awsRegion },
            maxRetries: 3
          })
        ).map(({ data }) => data && data.arn),
        [awsRegion]
      ) ?? `arn:aws:lambda:${awsRegion}:410797082306:layer:${layerName}:${fallbackVersion}`
    );
  }
}
