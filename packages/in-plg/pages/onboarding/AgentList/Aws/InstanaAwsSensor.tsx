/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import { Container, MainBody, SidePanel, Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import ExpandableCardPlg from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface Platforms {
  key: 'ec2' | 'ecs';
  label: string;
}

export default function InstanaAwsSensor({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  fromOnboarding
}: OnboardingProps) {
  const installationPlatforms: Platforms[] = [
    { key: 'ec2', label: t('in-plg:agentDetails.aws.ec2') },
    { key: 'ecs', label: t('in-plg:agentDetails.aws.ecs') }
  ];
  const [platform, setPlatform] = useState<Platforms>(installationPlatforms[0]);

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
    }
  ];

  function getIamPermissions() {
    if (platform.key === 'ec2') {
      return `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": [
              "apigateway:GET",
              "appsync:ListGraphqlApis",
              "appsync:GetGraphqlApi",
              "appsync:ListDataSources",
              "autoscaling:DescribeAutoScalingGroups",
              "cloudfront:GetDistribution",
              "cloudfront:ListDistributions",
              "cloudfront:ListTagsForResource",
              "docdb-elastic:ListClusters",
              "docdb-elastic:GetCluster",
              "docdb-elastic:ListTagsForResource",
              "dynamodb:ListTables",
              "dynamodb:DescribeTable",
              "dynamodb:ListTagsOfResource",
              "ec2:DescribeInstances",
              "ec2:DescribeTags",
              "ec2:DescribeVolumes",
              "elasticache:ListTagsForResource",
              "elasticache:DescribeCacheClusters",
              "elasticache:DescribeEvents",
              "elasticbeanstalk:DescribeEnvironments",
              "elasticbeanstalk:ListTagsForResource",
              "elasticbeanstalk:DescribeInstancesHealth",
              "elasticloadbalancing:DescribeLoadBalancers",
              "elasticloadbalancing:DescribeTags",
              "elasticmapreduce:ListClusters",
              "elasticmapreduce:DescribeCluster",
              "es:ListDomainNames",
              "es:DescribeElasticsearchDomain",
              "es:ListTags",
              "iot:DescribeEndpoint",
              "iot:ListThings",
              "kafka:ListClusters",
              "kafka:ListNodes",
              "kafka:ListTagsForResource",
              "kafka:DescribeCluster",
              "kinesis:ListStreams",
              "kinesis:DescribeStream",
              "kinesis:ListTagsForStream",
              "lambda:ListTags",
              "lambda:ListFunctions",
              "lambda:ListVersionsByFunction",
              "lambda:ListEventSourceMappings",
              "lambda:GetFunctionConfiguration",
              "mq:ListBrokers",
              "mq:DescribeBroker",
              "rds:DescribeDBClusters",
              "rds:DescribeDBInstances",
              "rds:DescribeEvents",
              "rds:ListTagsForResource",
              "redshift:DescribeClusters",
              "s3:GetBucketTagging",
              "s3:ListAllMyBuckets",
              "s3:GetBucketLocation",
              "s3:GetBucketPolicyStatus",
              "sns:GetTopicAttributes",
              "sns:ListTagsForResource",
              "sns:ListTopics",
              "sqs:ListQueues",
              "sqs:GetQueueAttributes",
              "sqs:ListQueueTags",
              "timestream:ListDatabases",
              "timestream:DescribeEndpoints",
              "timestream:DescribeDatabase",
              "timestream:ListTagsForResource",
              "xray:BatchGetTraces",
              "xray:GetTraceSummaries",
              "tag:GetResources"
            ],
            "Effect": "Allow",
            "Resource": "*"
          },
          {
            "Action": [
              "cloudwatch:GetMetricStatistics",
              "cloudwatch:GetMetricData",
              "cloudwatch:ListMetrics"
            ],
            "Effect": "Allow",
            "Resource": "*"
          }
        ]
      }`;
    } else {
      return `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": [
              "apigateway:GET",
              "appsync:ListGraphqlApis",
              "appsync:GetGraphqlApi",
              "appsync:ListDataSources",
              "autoscaling:DescribeAutoScalingGroups",
              "cloudfront:GetDistribution",
              "cloudfront:ListDistributions",
              "cloudfront:ListTagsForResource",
              "dynamodb:ListTables",
              "dynamodb:DescribeTable",
              "dynamodb:ListTagsOfResource",
              "ec2:DescribeInstances",
              "ec2:DescribeTags",
              "ec2:DescribeVolumes",
              "elasticache:ListTagsForResource",
              "elasticache:DescribeCacheClusters",
              "elasticache:DescribeEvents",
              "elasticbeanstalk:DescribeEnvironments",
              "elasticbeanstalk:ListTagsForResource",
              "elasticbeanstalk:DescribeInstancesHealth",
              "elasticloadbalancing:DescribeLoadBalancers",
              "elasticloadbalancing:DescribeTags",
              "elasticmapreduce:ListClusters",
              "elasticmapreduce:DescribeCluster",
              "es:ListDomainNames",
              "es:DescribeElasticsearchDomain",
              "es:ListTags",
              "iot:DescribeEndpoint",
              "iot:ListThings",
              "kafka:ListClusters",
              "kafka:ListNodes",
              "kafka:ListTagsForResource",
              "kafka:DescribeCluster",
              "kinesis:ListStreams",
              "kinesis:DescribeStream",
              "kinesis:ListTagsForStream",
              "lambda:ListTags",
              "lambda:ListFunctions",
              "lambda:ListVersionsByFunction",
              "lambda:ListEventSourceMappings",
              "lambda:GetFunctionConfiguration",
              "mq:ListBrokers",
              "mq:DescribeBroker",
              "rds:DescribeDBInstances",
              "rds:DescribeEvents",
              "rds:ListTagsForResource",
              "redshift:DescribeClusters",
              "s3:GetBucketTagging",
              "s3:ListAllMyBuckets",
              "s3:GetBucketLocation",
              "s3:GetBucketPolicyStatus",
              "sns:GetTopicAttributes",
              "sns:ListTagsForResource",
              "sns:ListTopics",
              "sqs:ListQueues",
              "sqs:GetQueueAttributes",
              "sqs:ListQueueTags",
              "timestream:ListDatabases",
              "timestream:DescribeEndpoints",
              "timestream:DescribeDatabase",
              "timestream:ListTagsForResource",
              "xray:BatchGetTraces",
              "xray:GetTraceSummaries",
              "tag:GetResources"
            ],
            "Effect": "Allow",
            "Resource": "*"
          },
          {
            "Action": [
              "cloudwatch:GetMetricStatistics",
              "cloudwatch:GetMetricData",
              "cloudwatch:ListMetrics"
            ],
            "Effect": "Allow",
            "Resource": "*"
          }
        ]
      }`;
    }
  }

  const trustRelationships = `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }`;

  const taskDefinitions = `
  {
    "family": "instana-aws-sensor",
    "containerDefinitions": [
      {
        "name": "aws-sensor",
        "image": "icr.io/instana/agent",
        "environment": [
          {
            "name": "INSTANA_AGENT_ENDPOINT",
            "value": "${agentEndpoint}"
          },
          {
            "name": "INSTANA_AGENT_ENDPOINT_PORT",
            "value": ${agentEndpointPort}
          },
          {
            "name": "INSTANA_AGENT_KEY",
            "value": "${agentKey}"
          },
          {
            "name": "INSTANA_DOWNLOAD_KEY",
            "value": "${downloadKey}"
          },
          {
            "name": "INSTANA_AGENT_MODE",
            "value": "AWS"
          }
        ]
      }
    ],
    "cpu": "2048",
    "memory": "4096",
    "requiresCompatibilities": [
      "FARGATE"
    ],
    "networkMode": "awsvpc"
  }`;

  function renderContent() {
    if (platform.key === installationPlatforms[0].key) {
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
                value={
                  <InputWithButton type="copy" displayContent="IAM_permission.json" inputValue={getIamPermissions()} />
                }
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
              value={<InputWithButton type="copy" displayContent="task_definition.json" inputValue={taskDefinitions} />}
              withGap
            />
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.aws.assignECSTaskDefinitionWithFollowingIAMPermission')}
            </Typography>
            <KeyValue
              label={t('in-plg:agentDetails.aws.iamPermissions')}
              value={
                <InputWithButton type="copy" displayContent="IAMpermissions.json" inputValue={getIamPermissions()} />
              }
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
                <RadioButton
                  label={installationPlatforms[0].label}
                  checked={platform.key === 'ec2'}
                  onChange={() => setPlatform(installationPlatforms[0])}
                  size="default"
                />
                <RadioButton
                  label={installationPlatforms[1].label}
                  checked={platform.key === 'ecs'}
                  onChange={() => setPlatform(installationPlatforms[1])}
                  size="default"
                />
              </Stack>
            }
            withGap
          />
        </LayoutSection>
        {renderContent()}
        <GetDeployedAgents agent="aws" fromOnboarding={fromOnboarding} />
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
