/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';

import { Container, MainBody, SidePanel, Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import ExpandableCardPlg from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function InstanaAwsSensor({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain
}: OnboardingProps) {
  const installationPlatforms = [t('in-plg:agentDetails.aws.ec2'), t('in-plg:agentDetails.aws.ecs')];
  const [platform, setPlatform] = useState(installationPlatforms[0]);

  const supportData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack direction="vertical">
          <Stack direction="vertical" gap="small">
            <DocumentLink
              text={t('in-plg:agentDetails.aws.documentationLinks.monitoredAwsServices')}
              href="https://ibm.biz/insta-agent-awsec2inst"
            />
          </Stack>
          <Stack direction="vertical" gap="small">
            <DocumentLink
              text={t('in-plg:agentDetails.aws.documentationLinks.installAgentOnEc2')}
              href="https://ibm.biz/insta-agent-awsec2svces"
            />
          </Stack>
          <Stack direction="vertical" gap="small">
            <DocumentLink
              text={t('in-plg:agentDetails.aws.documentationLinks.configurationOptions')}
              href="https://ibm.biz/insta-agent-awsec2cfg"
            />
          </Stack>
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  const trustRelationships = `
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }
    ]
  }`;

  const iamPermissions = `
  {
    Version: '2012-10-17',
    Statement: [
      {
        Action: [
          'elasticbeanstalk:DescribeEnvironments',
          'elasticbeanstalk:ListTagsForResource',
          'elasticbeanstalk:DescribeInstancesHealth',
          'dynamodb:ListTables',
          'dynamodb:DescribeTable',
          'dynamodb:ListTagsOfResource',
          'rds:DescribeDBInstances',
          'rds:DescribeEvents',
          'rds:ListTagsForResource',
          'sqs:ListQueues',
          'sqs:GetQueueAttributes',
          'sqs:ListQueueTags',
          'elasticache:ListTagsForResource',
          'elasticache:DescribeCacheClusters',
          'elasticache:DescribeEvents',
          'elasticloadbalancing:DescribeLoadBalancers',
          'elasticloadbalancing:DescribeTags',
          'elasticmapreduce:ListClusters',
          'elasticmapreduce:DescribeCluster',
          'es:ListDomainNames',
          'es:DescribeElasticsearchDomain',
          'es:ListTags',
          'ec2:DescribeInstances',
          'ec2:DescribeTags',
          'ec2:DescribeVolumes',
          'kafka:ListClusters',
          'kafka:ListNodes',
          'kafka:ListTagsForResource',
          'kafka:DescribeCluster',
          'kinesis:ListStreams',
          'kinesis:DescribeStream',
          'kinesis:ListTagsForStream',
          'lambda:ListTags',
          'lambda:ListFunctions',
          'lambda:ListVersionsByFunction',
          'lambda:ListEventSourceMappings',
          'lambda:GetFunctionConfiguration',
          'mq:ListBrokers',
          'mq:DescribeBroker',
          's3:GetBucketTagging',
          's3:ListAllMyBuckets',
          's3:GetBucketLocation',
          'xray:BatchGetTraces',
          'xray:GetTraceSummaries',
          'tag:GetResources'
        ],
        Effect: 'Allow',
        Resource: '*'
      },
      {
        Action: ['cloudwatch:GetMetricStatistics', 'cloudwatch:GetMetricData', 'cloudwatch:ListMetrics'],
        Effect: 'Allow',
        Resource: '*'
      }
    ]
  }
  `;

  function renderContent() {
    if (platform === installationPlatforms[0]) {
      return (
        <Wrapper>
          <LayoutSection
            title={
              t('in-plg:agentDetails.aws.step2') +
              t('in-plg:agentDetails.aws.reviewThePrerequisitesAndRunTheAgentDeploymentCode')
            }
          >
            <Code
              lang="bash"
              code={[
                `#!/bin/bash`,
                ` `,
                `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent`,
                'chmod 700 ./setup_agent.sh',
                `sudo ./setup_agent.sh -y -a ${agentKey} -d ${downloadKey} -m aws -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s`
              ]}
            />
          </LayoutSection>

          <LayoutSection
            title={
              t('in-plg:agentDetails.aws.step3') +
              t('in-plg:agentDetails.aws.setIAMPermissionsAndEditTrustRelationship')
            }
          >
            <Stack direction="horizontal">
              <KeyValue
                label={t('in-plg:agentDetails.aws.iamPermissions')}
                value={<InputWithButton type="copy" displayContent="IAM_permission.json" inputValue={iamPermissions} />}
                withGap
              />
              <KeyValue
                label={t('in-plg:agentDetails.aws.trustRelationships')}
                value={
                  <InputWithButton
                    type="copy"
                    displayContent="trust_relationship.json"
                    inputValue={trustRelationships}
                  />
                }
                withGap
              />
            </Stack>
          </LayoutSection>
        </Wrapper>
      );
    } else {
      return (
        <LayoutSection
          title={t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.createECSTaskDefinition')}
        >
          <Stack direction="vertical">
            <Typography variant="body-regular">{t('in-plg:agentDetails.aws.createECSTaskDefinition')}</Typography>
            <KeyValue
              label={t('in-plg:agentDetails.aws.taskDefinition')}
              value={<InputWithButton type="copy" displayContent="task_definition.json" inputValue={iamPermissions} />}
              withGap
            />
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.assignECSTaskDefinitionWithFollowingIAMPermission')}
            </Typography>
            <KeyValue
              label={t('in-plg:agentDetails.aws.iamPermissions')}
              value={<InputWithButton type="copy" displayContent="IAMpermissions.json" inputValue={iamPermissions} />}
              withGap
            />
          </Stack>
        </LayoutSection>
      );
    }
  }

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectWhereToRunAwsAgentOn')}
        >
          <KeyValue
            label={t('in-plg:agentDetails.gcp.installationMethod')}
            value={
              <Stack direction="horizontal">
                <CheckboxFancy
                  label={installationPlatforms[0]}
                  checked={platform === installationPlatforms[0]}
                  onChange={() => setPlatform(installationPlatforms[0])}
                  size="default"
                  asRadioButton
                />
                <CheckboxFancy
                  label={installationPlatforms[1]}
                  checked={platform === installationPlatforms[1]}
                  onChange={() => setPlatform(installationPlatforms[1])}
                  size="default"
                  asRadioButton
                />
              </Stack>
            }
            withGap
          />
        </LayoutSection>
        {renderContent()}
        <GetDeployedAgents agent="aws" />
      </MainBody>
      <SidePanel>
        <Typography variant="body-bold">Support</Typography>
        <>
          {supportData.map((sideCard, index) => (
            <ExpandableCardPlg
              key={index}
              title={sideCard.title}
              body={sideCard.body}
              openByDefault={sideCard.openByDefault}
            />
          ))}
        </>
      </SidePanel>
    </Container>
  );
}
