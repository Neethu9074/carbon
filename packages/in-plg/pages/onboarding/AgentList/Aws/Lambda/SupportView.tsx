/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

interface Runtime {
  runtime: 'Go' | 'Java' | 'NodeJs10' | 'NodeJs8' | 'Python' | 'Ruby' | 'Dotnet' ;
}

export const Documentations = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case 'Dotnet':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForDotNet')}
            href="https://ibm.biz/aws-lambda-tracing-dotnet"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaFunctions')}
            href="https://ibm.biz/insta-aws-lambda-docs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaEnvVariables')}
            href="https://ibm.biz/aws-lambda-envvars"
          />
        </Stack>
      );
    case 'Go':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForGo')}
            href="https://ibm.biz/aws-lambda-tracing-go"
          />
        </Stack>
      );
    case 'Java':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaFunctions')}
            href="https://ibm.biz/insta-aws-lambda-docs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForJava')}
            href="https://ibm.biz/aws-lambda-tracing-java"
          />
        </Stack>
      );
    case 'NodeJs10':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForNodeJs')}
            href="https://ibm.biz/aws-lambda-tracing-nodejs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaFunctions')}
            href="https://ibm.biz/insta-aws-lambda-docs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaEnvVariables')}
            href="https://ibm.biz/aws-lambda-envvars"
          />
        </Stack>
      );
    case 'NodeJs8':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.instanaLambdaLayerAndManualWrapping')}
            href="https://ibm.biz/aws-lambda-layer-manwrap"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForNodeJs')}
            href="https://ibm.biz/aws-lambda-tracing-nodejs"
          />
        </Stack>
      );
    case 'Python':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForPython')}
            href="https://ibm.biz/aws-lambda-tracing-python"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaFunctions')}
            href="https://ibm.biz/insta-aws-lambda-docs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaEnvVariables')}
            href="https://ibm.biz/aws-lambda-envvars"
          />
        </Stack>
      );
    case 'Ruby':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configuringAwsLambdaMonitoring')}
            href="https://ibm.biz/insta-aws-lambda-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForRuby')}
            href="https://ibm.biz/aws-lambda-tracing-ruby"
          />
        </Stack>
      );
    default:
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsServiceDocumentation')}
            href="https://ibm.biz/amazon-web-services-agent"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsLambda')}
            href="https://ibm.biz/agents-aws-lambda"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.awsLambdaNativeTracingForGo')}
            href="https://ibm.biz/aws-lambda-tracing-go"
          />
        </Stack>
      );
  }
};

export const Prerequisites = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case 'Go':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'Java':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'NodeJs10':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'NodeJs8':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'Python':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'Ruby':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    default:
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
  }
};
