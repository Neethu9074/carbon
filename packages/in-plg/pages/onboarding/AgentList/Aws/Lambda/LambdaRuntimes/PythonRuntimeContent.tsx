/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';
import { Link } from '@instana/components';

import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import { useLambdaLayerVersionObservable } from 'in-plg/api/NetworkUtil';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import Code from 'in-plg/components/Code/Code';
import { Trans, t } from 'in-i18n';

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

export default function PythonRuntimeContent({
  agentEndpoint,
  agentKey,
  agentEndpointPort,
  instanaDomain
}: OnboardingProps): JSX.Element {
  const [awsRegion, setAwsRegion] = useState(awsRegionOptions[6]);
  const [lambdaHandler, setLambdaHandler] = useState('index.handler');
  const [functionName, setFunctionName] = useState('my-lambda-function');
  const lambdaLayerVersionApiBaseUrl = `https://lambda-layers.instana.${instanaDomain}`;

  const pythonLayerVersion = '27';
  const pythonLayerArn = useLambdaLayerVersionObservable(
    lambdaLayerVersionApiBaseUrl,
    'instana-python',
    pythonLayerVersion,
    awsRegion
  );

  return (
    <Wrapper>
      <LayoutSection
        title={
          t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.setupUpInstanaAwsSensorRunningInAwsRegion')
        }
      >
        <Typography variant="body-regular">
          <Trans
            i18nKey={'in-plg:agentDetails.aws.referDocumentationForSettingUpAwsSensor'}
            components={{
              awsSensorDoc: (
                <Link
                  href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-amazon-web-services-aws-agent"
                  target="_blank"
                >
                  {t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
                </Link>
              )
            }}
          />
        </Typography>
      </LayoutSection>

      <LayoutSection
        title={
          t('in-plg:agentDetails.aws.step3') + t('in-plg:agentDetails.aws.setupAwsLambdaFunctionsForNativeTracing')
        }
      >
        <Wrapper>
          <Typography variant="body-regular">{t('in-plg:agentDetails.aws.awsLambdaPythonAutotrace')}</Typography>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.romanStep1') + t('in-plg:agentDetails.aws.selectAwsRegionAndLambdaHandler')}
            </Typography>
            <Stack direction="horizontal">
              <KeyValue
                label={t('in-plg:agentDetails.aws.awsRegion')}
                value={<DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />}
                withGap
              />
              <KeyValue
                label={t('in-plg:agentDetails.aws.lambdaFunctionName')}
                value={<FormInputPlg value={lambdaHandler} onChange={setLambdaHandler} />}
                withGap
              />
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.romanStep2') + t('in-plg:agentDetails.aws.selectInstanaLambdaLayer')}
            </Typography>
            <KeyValue
              label={t('in-plg:agentDetails.aws.amazonResourceName')}
              value={<InputWithButton type="copy" inputValue={pythonLayerArn} />}
              withGap
            />
          </Stack>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.romanStep3') +
                t('in-plg:agentDetails.aws.setInstanaAutoWrapHandlerAsLambdaFunction')}
            </Typography>
            <KeyValue
              label={t('in-plg:agentDetails.aws.autoWrapHandler')}
              value={<InputWithButton type="copy" inputValue={'instana-aws-lambda-auto-wrap.handler'} />}
              withGap
            />
          </Stack>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.setEnvVariablesInLambdaFunction')}
            </Typography>
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
          </Stack>
          <KeyValue
            label={t('in-plg:agentDetails.aws.lambdaHandler')}
            value={<InputWithButton type="copy" inputValue={'index.handler'} />}
            withGap
          />
        </Wrapper>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.aws.step4') + t('in-plg:agentDetails.aws.awsCommandLineInterfaceValue')}
      >
        <Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.aws.awsRegion')}
              value={<DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />}
              withGap
            />
            <KeyValue
              label={t('in-plg:agentDetails.aws.lambdaFunctionName')}
              value={<FormInputPlg value={functionName} onChange={setFunctionName} />}
              withGap
            />
          </Stack>
          <Code
            lang="bash"
            code={[
              '#!/bin/bash',
              ' ',
              '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
              '# Instead, use this as a template to define your own aws cli command.',
              `aws --region ${awsRegion} lambda update-function-configuration \\`,
              `--function-name ${functionName} \\`,
              `--layers ${pythonLayerArn} \\`,
              `--handler instana-aws-lambda-auto-wrap.handler`,
              `--environment "Variables={INSTANA_ENDPOINT_URL=${
                agentEndpoint + ':' + agentEndpointPort
              }, INSTANA_AGENT_KEY=${agentKey} }"`
            ]}
          />
        </Stack>
      </LayoutSection>
    </Wrapper>
  );
}
