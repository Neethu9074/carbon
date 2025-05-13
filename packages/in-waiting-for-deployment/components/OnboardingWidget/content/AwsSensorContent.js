/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import {
  Bash,
  Description,
  DropDown,
  HelpBox,
  JSONFile,
  Row,
  Spacer,
  TextWithLink
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function AwsSensorContent({ agentKey, downloadKey, agentEndpoint, agentEndpointPort }) {
  const platformOptions = [t('in-waiting-for-deployment:content.ec2'), t('in-waiting-for-deployment:content.ecs')];

  const [selectedPlatform, setPlatform] = useState(platformOptions[0]);

  let permissions = {
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
  };

  let content;

  const iamPermissions = (
    <>
      <JSONFile
        title={t('in-waiting-for-deployment:content.iamPermissions')}
        content={JSON.stringify(permissions, 0, 2)}
      />
    </>
  );

  if (selectedPlatform === platformOptions[0]) {
    let trustRelationship = {
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
    };

    content = (
      <>
        <Description lines={[t('in-waiting-for-deployment:aws.description')]} />
        <Bash
          lines={[
            `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent`,
            'chmod 700 ./setup_agent.sh',
            `sudo ./setup_agent.sh -y -a ${agentKey} -d ${downloadKey} -m aws -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s`
          ]}
        />
        <Spacer />
        <HelpBox title={t('in-waiting-for-deployment:aws.help.title')}>
          <TextWithLink
            i18nKey="in-waiting-for-deployment:aws.help.text"
            href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
          />
        </HelpBox>
        <Spacer />
        <Description lines={[t('in-waiting-for-deployment:aws.secText.line1')]} />
        {iamPermissions}
        <Spacer />
        <Description lines={[t('in-waiting-for-deployment:aws.secText.line2')]} />
        <JSONFile
          title={t('in-waiting-for-deployment:content.trustRelationship')}
          content={JSON.stringify(trustRelationship, 0, 2)}
        />
      </>
    );
  } else if (selectedPlatform === platformOptions[1]) {
    const taskDefinition = {
      family: 'instana-aws-sensor',
      containerDefinitions: [
        {
          name: 'aws-sensor',
          image: 'icr.io/instana/agent',
          environment: [
            {
              name: 'INSTANA_AGENT_ENDPOINT',
              value: agentEndpoint
            },
            {
              name: 'INSTANA_AGENT_ENDPOINT_PORT',
              value: agentEndpointPort
            },
            {
              name: 'INSTANA_AGENT_KEY',
              value: agentKey
            },
            {
              name: 'INSTANA_DOWNLOAD_KEY',
              value: downloadKey
            },
            {
              name: 'INSTANA_AGENT_MODE',
              value: 'AWS'
            }
          ]
        }
      ],
      cpu: '2048',
      memory: '4096',
      requiresCompatibilities: ['FARGATE'],
      networkMode: 'awsvpc'
    };

    content = (
      <>
        <HelpBox title={t('in-waiting-for-deployment:content.ecsSupportedRuntimes')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.theAwsAgentCanRunOnBothEcsOnEc2AndFargateOnEcsUsingTheEcsPlatformsVersion13AndVersion14'
              )
            ]}
          />
        </HelpBox>
        <Spacer />
        <Description lines={[t('in-waiting-for-deployment:content.createAnEcsTaskDefinitionUsingThisTemplate')]} />
        <JSONFile
          title={t('in-waiting-for-deployment:content.taskDefinition')}
          content={JSON.stringify(taskDefinition, 0, 2)}
        />
        <Spacer />
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.assignToTheEcsTaskDefinitionARoleWithAtLeastTheFollowingIamPermissions'
            )
          ]}
        />
        {iamPermissions}
        <Spacer />
        <HelpBox title={t('in-waiting-for-deployment:content.ecsServiceDefinition')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.createAServiceUsingTheAboveTaskDefinitionAndRunOnlyOneInstanceToAvoidUnnecessaryChargesForTheCloudWatchApi'
              )
            ]}
          />
        </HelpBox>
      </>
    );
  }

  return (
    <>
      <HelpBox>
        <TextWithLink
          i18nKey="in-waiting-for-deployment:content.theAwsAgentMonitorsLotsOfDifferentAwsTechnologiesInOneSinglePackageForTheFullListReferToThe"
          href="https://www.ibm.com/docs/en/instana-observability/latest?topic=agents-amazon-web-services-aws-agent#monitored-services"
        />
      </HelpBox>

      <Spacer />

      <Row>
        {t('in-waiting-for-deployment:content.runYourAwsAgentOn')}
        <DropDown value={selectedPlatform} options={platformOptions} onChange={setPlatform} />
      </Row>

      <Spacer />

      {content}
    </>
  );
}
