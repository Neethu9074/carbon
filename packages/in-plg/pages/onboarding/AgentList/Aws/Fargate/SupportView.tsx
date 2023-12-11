/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

export const prerequisites = (runtime: 'Go' | 'Java' | 'Dotnet' | 'NodeJs' | 'Python' | 'Ruby') => {
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
    case 'Dotnet':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
    case 'NodeJs':
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

export const documentations = (runtime: 'Go' | 'Java' | 'Dotnet' | 'NodeJs' | 'Python' | 'Ruby') => {
  switch (runtime) {
    case 'Go':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGo')}
            href="https://ibm.biz/monitoring-go"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargate')}
            href="https://ibm.biz/monitoring-aws-fargate"
          />
        </Stack>
      );
    case 'Java':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargateJava')}
            href="https://ibm.biz/monitoring-fargate-java"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configureTaskDefinition')}
            href="https://ibm.biz/insta-fargate-taskdef"
          />
        </Stack>
      );
    case 'Dotnet':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargateDotnet')}
            href="https://ibm.biz/monitoring-fargate-dotnet"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configureTaskDefinition')}
            href="https://ibm.biz/insta-fargate-taskdef"
          />
        </Stack>
      );
    case 'NodeJs':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargateNodejs')}
            href="https://ibm.biz/monitoring-fargate-nodejs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configureTaskDefinition')}
            href="https://ibm.biz/insta-fargate-taskdef"
          />
        </Stack>
      );
    case 'Python':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargatePython')}
            href="https://ibm.biz/monitoring-fargate-python"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configureTaskDefinition')}
            href="https://ibm.biz/insta-fargate-taskdef"
          />
        </Stack>
      );
    case 'Ruby':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargateRuby')}
            href="https://ibm.biz/monitoring-fargate-ruby"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.configureTaskDefinition')}
            href="https://ibm.biz/insta-fargate-taskdef"
          />
        </Stack>
      );
    default:
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGo')}
            href="https://ibm.biz/monitoring-go"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringAwsFargate')}
            href="https://ibm.biz/monitoring-aws-fargate"
          />
        </Stack>
      );
  }
};
