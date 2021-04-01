/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';
import { useObservable } from '@instana/hooks';

import {
  Bash,
  CheckBox,
  Cmd,
  Description,
  Dockerfile,
  DownloadButton,
  DropDown,
  getAgentDownloadURL,
  HelpBox,
  Input,
  JSONFile,
  Listing,
  PowershellEC2,
  Row,
  Script,
  Spacer,
  TextWithLink,
  ValidatedInputFields,
  YAMLFile
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import instanaAgentOpenShiftYaml from 'in-waiting-for-deployment/components/OnboardingWidget/instana-agent-openshift.yaml';
import instanaAgentYaml from 'in-waiting-for-deployment/components/OnboardingWidget/instana-agent.yaml';
import createObservable from 'in-services/http/observableHttpResult';
import { Col, Row as GridRow } from 'in-new-components/layout/Grid';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import http from 'in-services/http';
import { t } from 'in-i18n';

const maxClusterNameRegex = new RegExp(/^[\w-_]{1,64}$/);

const lambdaLayerVersionApiBaseUrl = 'https://lambda-layers.instana.io';

function validateClusterName(clusterName) {
  return maxClusterNameRegex.test(clusterName);
}

const clusterNameValidator = {
  validator: validateClusterName,
  validationMessage: t(
    'in-waiting-for-deployment:content.theClusterNameMustBeACombinationOfLettersDashesAndUnderscoresUpTo64CharactersLong'
  )
};

const agentReleaseVersionRegex = new RegExp(/^\d\.\d{1,3}\.\d+$/);

function validateAgentReleaseVersion(agentReleaseVersion) {
  return agentReleaseVersionRegex.test(agentReleaseVersion);
}

function validateNotEmpty(value) {
  return !!value;
}

export default function getEntries({ disableAwsSensorDocumentation }) {
  return [
    {
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'lib_aws',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.instanaAwsSensor'),
          keyWords: 'aws',
          Content: AwsSensorContent
        },
        {
          label: t('in-waiting-for-deployment:content.elasticComputingEc2Linux'),
          keyWords: 'elasticcomputeec2linux',
          Content: ElasticComputingLinuxContent
        },
        {
          label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
          keyWords: 'elasticcomputeec2windows',
          Content: ElasticComputingWindowsContent
        },
        {
          label: t('in-waiting-for-deployment:content.elasticContainerServiceForKubernetesEks'),
          keyWords: 'elasticcontainerkubernetesk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: t('in-waiting-for-deployment:content.awsFargate'),
          keyWords: 'awsfargate',
          Content: AWSFargateContent
        },
        {
          label: t('in-waiting-for-deployment:content.awsLambda'),
          keyWords: 'awslambda',
          Content: AWSLambdaContent
        }
      ].filter(subTechnology =>
        disableAwsSensorDocumentation
          ? subTechnology.label !== t('in-waiting-for-deployment:content.instanaAwsSensor')
          : true
      )
    },
    {
      label: t('in-waiting-for-deployment:content.azure'),
      icon: 'lib_azure',
      fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
          keyWords: 'azurekubernetesk8s',
          Content: K8sDaemonSetContent
        }
      ]
    },
    {
      label: t('in-waiting-for-deployment:content.googleCloud'),
      icon: 'lib_google_cloud',
      fullLabel: t('in-waiting-for-deployment:content.googleCloudPlatform'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.googleComputeEngineGceLinux'),
          keyWords: 'googlecloudplatformcomputeenginelinuxgce',
          Content: GoogleComputeEngineContent
        },
        {
          label: t('in-waiting-for-deployment:content.googleKubernetesEngineGke'),
          keyWords: 'googlekubernetesenginegkek8s',
          Content: K8sGoogleKubernetesEngineContent
        },
        {
          label: t('in-waiting-for-deployment:content.googleCloudRun'),
          keyWords: 'googlecloudrun',
          Content: GoogleCloudRunContent
        }
      ]
    },
    {
      label: t('in-waiting-for-deployment:content.docker'),
      icon: 'lib_container_docker',
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'dockercontainer',
      Content: DockerContent
    },
    {
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.helmChart'),
          keyWords: 'kuberneteshelmchartk8s',
          Content: K8sHelmChartContent
        },
        {
          label: t('in-waiting-for-deployment:content.yaml'),
          keyWords: 'kubernetesdeamonsetk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: t('in-waiting-for-deployment:content.operator'),
          keywords: 'kubernetesoperatork8s',
          Content: K8sOperatorContent
        },
        {
          label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
          keyWords: 'azurekubernetesserviceaksk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: t('in-waiting-for-deployment:content.awsElasticKubernetesServiceEks'),
          keyWords: 'awselastickubernetesserviceeksk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: t('in-waiting-for-deployment:content.googleKubernetesEngineGke'),
          keyWords: 'googlekubernetesenginegkek8s',
          Content: K8sGoogleKubernetesEngineContent
        }
      ]
    },
    {
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.yaml'),
          keyWords: 'kubernetesdeamonsetk8s',
          Content: OpenShiftDaemonSetContent
        },
        {
          label: t('in-waiting-for-deployment:content.helmChart'),
          keyWords: 'openshifthelmchartk8s',
          Content: OpenShiftHelmContent
        },
        {
          label: t('in-waiting-for-deployment:content.operator'),
          keywords: 'kubernetesoperatork8s',
          Content: OpenShiftOperatorContent
        }
      ]
    },
    {
      label: t('in-waiting-for-deployment:content.cloudFoundryAndBosh'),
      fullLabel: t('in-waiting-for-deployment:content.cloudFoundryAndOtherBoshBasedDeployments'),
      icon: 'lib_cloudfoundry',
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'cloudfoundryboshcf',
      Content: CfAndBoshContent
    },
    {
      label: t('in-waiting-for-deployment:content.vMwareTanzu'),
      icon: 'lib_vmware_tanzu',
      fullLabel: t('in-waiting-for-deployment:content.vMwareTanzuFormerlyKnownAsPivotalCloudFoundry'),
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'pivotalplatformpivotalcloudfoundrypcf',
      Content: PcfContent
    },
    {
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
          keyWords: 'linuxautomaticoneliner',
          Content: OneLinerContent
        },
        {
          label: t('in-waiting-for-deployment:content.packagesDebRpm'),
          keyWords: 'linuxpackagesdebrpm',
          Content: PackagesContent
        },
        {
          label: t('in-waiting-for-deployment:content.archiveTarGz'),
          keyWords: 'linuxmanualtarball',
          Content: ManualLinuxContent
        },
        {
          label: t('in-waiting-for-deployment:content.awsElasticComputingEc2'),
          keyWords: 'linuxawselasticcomputingec2',
          Content: ElasticComputingLinuxContent
        },
        {
          label: t('in-waiting-for-deployment:content.googleComputeEngineGce'),
          keyWords: 'linuxgooglecomputeenginegce',
          Content: GoogleComputeEngineContent
        }
      ]
    },
    {
      label: t('in-waiting-for-deployment:content.macOs'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'macosx',
      icon: 'lib_apple',
      Content: ManualMacOsContent
    },
    {
      label: t('in-waiting-for-deployment:content.unix'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'unixtarball',
      icon: 'lib_unix',
      Content: ManualUnixContent
    },
    {
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnologies: [
        {
          label: t('in-waiting-for-deployment:content.windowsInstaller64Bit'),
          keyWords: 'windowsexe',
          Content: WindowsInstallerContent
        },
        {
          label: t('in-waiting-for-deployment:content.windowsInstaller64BitUnattended'),
          keyWords: 'windowsexe',
          Content: WindowsInstallerUnattendedContent
        },
        {
          label: t('in-waiting-for-deployment:content.zipArchives'),
          keyWords: 'windowszip',
          Content: ManualWindowsContent
        },
        {
          label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
          keyWords: 'elasticcomputeec2windows',
          Content: ElasticComputingWindowsContent
        }
      ]
    }
  ];
}

function AwsSensorContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const platformOptions = ['Elastic Compute Cloud (EC2)', 'Elastic Container Service (ECS)'];

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
    <Fragment>
      <JSONFile
        title={t('in-waiting-for-deployment:content.iamPermissions')}
        content={JSON.stringify(permissions, 0, 2)}
      />
    </Fragment>
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
      <Fragment>
        <Description lines={[t('in-waiting-for-deployment:aws.description')]} />
        <Bash
          lines={[
            'curl -o setup_agent.sh https://setup.instana.io/agent',
            'chmod 700 ./setup_agent.sh',
            `sudo ./setup_agent.sh -y -a ${agentKey} -m aws -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s`
          ]}
        />
        <Spacer />
        <HelpBox title={t('in-waiting-for-deployment:aws.help.title')}>
          <TextWithLink
            text={t('in-waiting-for-deployment:aws.help.text')}
            linkText={t('in-waiting-for-deployment:aws.help.linkText')}
            href={t('in-waiting-for-deployment:aws.help.link')}
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
      </Fragment>
    );
  } else if (selectedPlatform === platformOptions[1]) {
    const taskDefinition = {
      family: 'instana-aws-sensor',
      containerDefinitions: [
        {
          name: 'aws-sensor',
          image: 'instana/agent',
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
      <Fragment>
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
      </Fragment>
    );
  }

  return (
    <>
      <HelpBox>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theAwsAgentMonitorsLotsOfDifferentAwsTechnologiesInOneSinglePackageForTheFullListReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.supportedAwsServicesList')}
          href="https://instana.com/docs/ecosystem/aws/#monitored-services"
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

function AWSFargateContent({ agentKey, serverlessEndpoint }) {
  const runtimeOptions = ['Go', 'Java', '.NET Core', 'Node.js', 'Python'];
  const baseImageOptions = ['Linux (glibc-based)', 'Alpine Linux (musl-based)'];

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
            'COPY --from=containers.instana.io/instana/release/aws/fargate/jvm /instana /instana',
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
        <Bash lines={[`docker login containers.instana.io --username _ --password ${agentKey}`]} />

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

function AWSLambdaContent({ agentKey, serverlessEndpoint }) {
  const runtimeOptions = ['Go', 'Java', 'Node.js 10.x or newer', 'Node.js 8.x', 'Python 2.7 and 3.x'];
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

  const nodejsLayerVersionFallback = '40';
  const nodejsLayerArn = useLambdaLayerVersionObservable('instana-nodejs', nodejsLayerVersionFallback);
  const pythonLayerVersion = '20';
  const pythonLayerArn = useLambdaLayerVersionObservable('instana-python', pythonLayerVersion);
  const javaLayerVersion = '21';
  const javaLayerArn = useLambdaLayerVersionObservable('instana-java', javaLayerVersion);

  if (selectedRuntime === runtimeOptions[0]) {
    // Golang
    steps = (
      <Fragment>
        <Spacer />

        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.awsLambdaFunctionsWrittenInGoNeedToBeManuallyInstrumentedInOrderToCollectTraceDataFollowTheInstructionsOfThe'
          )}
          linkText={t('in-waiting-for-deployment:content.awsLambdaGoDocumentation')}
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
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[1]) {
    // Java
    steps = (
      <Fragment>
        <HelpBox title={t('in-waiting-for-deployment:content.configuringYourAwsLambdaFunction')}>
          <Description
            lines={[
              t(
                'in-waiting-for-deployment:content.noteThatTheJava8RuntimeIsNotSupportedCurrentlyOnlySupportedRuntimesAreJava8A12AndJava11'
              )
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
            text={t(
              'in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur'
            )}
            linkText={t('in-waiting-for-deployment:content.documentationForLambdaAutoTrace')}
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
              <Fragment>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[javaLayerArn]} />
                (
                <TextWithLink
                  text={t('in-waiting-for-deployment:content.see')}
                  linkText={t('in-waiting-for-deployment:content.awsDocs')}
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )<Spacer />
              </Fragment>,
              <Fragment>
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
              </Fragment>
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
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[2]) {
    // Node.js >= 10.x
    steps = (
      <Fragment>
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
            text={t(
              'in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur'
            )}
            linkText={t('in-waiting-for-deployment:content.documentationForLambdaAutoTrace')}
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
              <Fragment>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[nodejsLayerArn]} />
                (
                <TextWithLink
                  text={t('in-waiting-for-deployment:content.see')}
                  linkText={t('in-waiting-for-deployment:content.awsDocs')}
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </Fragment>,
              <Fragment>
                <Spacer />
                {t('in-waiting-for-deployment:content.setInstanaAutoWrapHandlerAsTheHandlerForYourLambdaFunction')}
                <Spacer />
                <Script lines={['instana-aws-lambda-auto-wrap.handler']} />(
                <TextWithLink
                  text={t('in-waiting-for-deployment:content.see')}
                  linkText={t('in-waiting-for-deployment:content.awsDocs')}
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </Fragment>,
              <Fragment>
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
              </Fragment>
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
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[3]) {
    // Node.js 8.x
    steps = (
      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.thePreferredWayToConfigureAwsLambdaFunctionsBasedOnNodeJs8XIsToUseThe'
        )}
        linkText={t('in-waiting-for-deployment:content.instanaLambdaLayerWithManualWrapping')}
        href="https://instana.com/docs/ecosystem/aws-lambda#manual-wrapping"
      />
    );
  } else if (selectedRuntime === runtimeOptions[4]) {
    // Python
    steps = (
      <Fragment>
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
            text={t(
              'in-waiting-for-deployment:content.aDetailedGuideIncludingScreenshotsOnHowToConfigureYourLambdaFunctionForAutoTraceUsingTheAwsWebConsoleCanBeFoundInOur'
            )}
            linkText={t('in-waiting-for-deployment:content.documentationForLambdaAutoTrace')}
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
              <Fragment>
                {t('in-waiting-for-deployment:content.addTheInstanaLambdaLayerWithTheArn')}
                <Spacer />
                <Script lines={[pythonLayerArn]} />
                (
                <TextWithLink
                  text={t('in-waiting-for-deployment:content.see')}
                  linkText={t('in-waiting-for-deployment:content.awsDocs')}
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </Fragment>,
              <Fragment>
                <Spacer />
                {t('in-waiting-for-deployment:content.setInstanaAutoWrapHandlerAsTheHandlerForYourLambdaFunction')}
                <Spacer />
                <Script lines={['instana.lambda_handler']} />(
                <TextWithLink
                  text={t('in-waiting-for-deployment:content.see')}
                  linkText={t('in-waiting-for-deployment:content.awsDocs')}
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </Fragment>,
              <Fragment>
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
              </Fragment>
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
      </Fragment>
    );
  }

  return (
    <>
      <Row>
        {t('in-waiting-for-deployment:content.selectYourLambdaRuntime')}
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.makeSureYouHaveAnInstanaAwsSensorRunningInYourAwsRegionForDetailsOnSettingUpTheInstanaAwsSensorReferToThe'
        )}
        linkText={t('in-waiting-for-deployment:content.awsServiceDocumentation')}
        href="https://instana.com/docs/ecosystem/aws"
      />
      <Spacer />

      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.nextConfigureYourAwsLambdaFunctionsForNativeTracingAsDescribedInTheStepsBelowOtherOptionsToSetUpNativeLambdaTracingAndMoreDetailsAboutThisFeatureAreAvailableInThe'
        )}
        linkText={t('in-waiting-for-deployment:content.documentation')}
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

function ElasticComputingWindowsContent({ agentKey, agentEndpoint, agentEndpointPort, tenant, tenantUnit }) {
  const agentModeOptions = [
    t('in-waiting-for-deployment:content.dynamicAgent'),
    t('in-waiting-for-deployment:content.staticAgent')
  ];
  const [agentMode, setMode] = useState(agentModeOptions[0]);

  return (
    <>
      <Row>
        <DropDown value={agentMode} options={agentModeOptions} onChange={setMode} />
      </Row>
      <Spacer />
      <Description lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsUserDataForTheEc2Instance')]} />
      <PowershellEC2
        lines={[
          `Invoke-WebRequest -OutFile "$env:TEMP\\AgentBootstrap.exe" -Uri "https://instana.io/assets/agent/${tenant}/${tenantUnit}?agentKey=${agentKey}&type=exe64"`,
          `Invoke-Expression -Command "$env:TEMP\\AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} /quiet"`
        ]}
      />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.theUserDataScriptAboveWillDownloadTheHostAgentInstallItOnTheVirtualMachineAsAWindowsServiceAndThenAutomaticallyStartIt'
          )
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.userDataInAwsEc2')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveWithUserDataInAwsEc2ReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.runningCommandsOnYourWindowsInstanceAtLaunchPage')}
          href="https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-windows-user-data.html#user-data-scripts"
        />
      </HelpBox>
    </>
  );
}

function ElasticComputingLinuxContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <Description lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsUserDataForTheEc2Instance')]} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'}`
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.userDataInAwsEc2')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveWithUserDataInAwsEc2ReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.runningCommandsOnYourLinuxInstanceAtLaunchPage')}
          href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
        />
      </HelpBox>
    </>
  );
}

function DockerContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');
  const lines = [
    'sudo docker run \\',
    '--detach \\',
    '--name instana-agent \\',
    '--volume /var/run:/var/run \\',
    '--volume /run:/run \\',
    '--volume /dev:/dev \\',
    '--volume /sys:/sys \\',
    '--volume /var/log:/var/log \\',
    '--privileged \\',
    '--net=host \\',
    '--pid=host \\',
    '--ipc=host \\',
    `--env="INSTANA_AGENT_ENDPOINT=${agentEndpoint}" \\`,
    `--env="INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort}" \\`,
    `--env="INSTANA_AGENT_KEY=${agentKey}" \\`,
    'instana/agent'
  ];
  if (zoneName) {
    lines.push(`--env="INSTANA_AGENT_ZONE=${zoneName}" \\`, lines.pop());
  }

  return (
    <>
      <Input
        id="zone-name"
        value={zoneName}
        onChange={onZoneNameChange}
        placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
      />
      <Bash lines={lines} />
    </>
  );
}

function OneLinerContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  const installModeOptions = ['interactive', 'silent'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const [isService, setIsService] = useState(false);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentInstallationModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentInstallationModeInteractive')}
              checked={installMode === installModeOptions[0]}
              onChange={() => setInstallMode(installModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentInstallationModeSilent')}
              checked={installMode === installModeOptions[1]}
              onChange={() => setInstallMode(installModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <CheckBox
        label={t('in-waiting-for-deployment:content.installAndStartAsServiceOnlySupportedForSystemDBasedSystems')}
        checked={isService}
        setChecked={setIsService}
      />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'} ${
            installMode === installModeOptions[0] ? '' : '-y'
          } ${isService ? '-s' : ''}
          `
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedOperatingSystems')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.ubuntuLinux1404160418042004'),
            t('in-waiting-for-deployment:content.centOs678'),
            t('in-waiting-for-deployment:content.debian910'),
            t('in-waiting-for-deployment:content.suseLinuxEnterpriseServerSles12'),
            t('in-waiting-for-deployment:content.redhatEnterpriseLinuxRhel678'),
            t('in-waiting-for-deployment:content.amazonLinux12')
          ]}
        />
      </HelpBox>
    </>
  );
}

function GoogleComputeEngineContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <Fragment>
          <h4>Agent mode</h4>
          <p>
            <CheckboxFancy
              label="Dynamic"
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Static"
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>Agent JDK</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <Description
        lines={[t('in-waiting-for-deployment:content.useTheFollowingScriptAsStartupScriptForTheGceInstance')]}
      />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo apt-get install apt-transport-https ca-certificates && sudo ./setup_agent.sh -a ${agentKey} -t ${
            agentMode === 'dynamic' ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} -s -y ${jvmVendor === jvmVendorOptions[0] ? '' : '-j'}`
        ]}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.startupScriptsInGoogleComputeEngine')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.forMoreInformationOnHowToUseTheScriptAboveAsAStartupScriptInGceReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.runningStartupScriptsPage')}
          href="https://cloud.google.com/compute/docs/startupscript"
        />
      </HelpBox>
    </>
  );
}

function K8sGoogleKubernetesEngineContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.installingTheInstanaAgentOnGoogleKubernetesEngineIsIntegratedInThe')}
        href="https://console.cloud.google.com/marketplace/details/instana-public/instana?q=instana"
        linkText={t('in-waiting-for-deployment:content.googleCloudMarketplace')}
      />
      <Spacer />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.clickOnConfigureAndSelectTheOrganizationOrProjectContainingTheKubernetesClusterYouWantToDeployInstanaToTheFollowingConfigurationsHaveToBeAppliedDuringTheConfigureStepInTheGoogleCloudPlatformConsole'
          )
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServiceEndpoint')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServicePort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaApplicationKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourGkeCluster')}>
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.youLikelyWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevRatherThanTheDefaultKubernetesClusterViaTheInstanaZoneSettingInTheConfigureStep'
            )
          ]}
        />
      </HelpBox>
    </>
  );
}

function GoogleCloudRunContent({ agentKey, serverlessEndpoint }) {
  const installationMethods = ['Docker build', 'Cloud Native Buildpack'];
  const runtimeOptions = ['.Net Core', 'Go', 'Java', 'Node.js'];
  const baseImageOptions = ['Linux (glibc-based)', 'Alpine Linux (musl-based)'];
  const [baseImageName, setBaseImageName] = useState(baseImageOptions[0]);
  const [appDirName, setAppDirName] = useState('/app');

  const [selectedInstallationMethod, setInstallationMethod] = useState(installationMethods[0]);
  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);

  let steps;

  if (selectedInstallationMethod === installationMethods[1]) {
    steps = (
      <Fragment>
        <Spacer />
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theInstanaGoogleBuildpackIsACloudNativeBuildpackDesignedToWorkWithTheGoogleCloudRunBuildpackBuilderForMoreInformationOnTheGoogleCloudRunBuildpackBuilderReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.googleCloudRunBuildpackBuilderDocumentation')}
          href="https://github.com/GoogleCloudPlatform/buildpacks"
        />
        <Spacer />
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.theInstanaGoogleBuildpackAddsTheInstanaInProcessCollectorsForCloudRunToTheDockerImagesOfYourNetCoreNodeJsAndJavaApplications'
            )
          ]}
        />
        <Spacer />
        <Bash
          lines={[
            `echo '${agentKey}' | docker login --username "_" --password-stdin containers.instana.io`,
            'pack build <image-name> --buildpack from=builder --buildpack containers.instana.io/instana/release/google/buildpack --builder gcr.io/buildpacks/builder'
          ]}
        />
        <Spacer />
        <TextWithLink
          text={t('in-waiting-for-deployment:content.thePackUtilityIsProvidedByThe')}
          linkText={t('in-waiting-for-deployment:content.cloudNativeBuildpacksProject')}
          href="https://buildpacks.io/docs/tools/pack/"
        />
        <Spacer />

        <Description
          lines={[
            t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheCloudRunServiceRevision')
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
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[0]) {
    steps = (
      <Fragment>
        <Spacer />
        <Description lines={[t('in-waiting-for-deployment:content.linuxBaseImage')]} />
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
          lines={[
            t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesOnTheCloudRunServiceDefinition')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.yourApplicationDirectoryInTheContainerYouUsuallySetThisAsTheWorkdirDirectoryInTheDockerfile'
            )
          ]}
        />
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
  } else if (selectedRuntime === runtimeOptions[1]) {
    steps = (
      <Fragment>
        <Spacer />

        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.theSupportForGoOnGoogleCloudRunFullyManagedWorksTheSameWayAsWithAnyGoApplicationFollowTheInstructionsOfThe'
          )}
          linkText={t('in-waiting-for-deployment:content.goDocumentation')}
          href="https://instana.com/docs/ecosystem/go"
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheCloudRunServiceRevision')
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
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[2]) {
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
            'COPY --from=containers.instana.io/instana/release/google/cloud-run/jvm /instana /instana',
            'ENV JAVA_TOOL_OPTIONS="-javaagent:/instana/instana-standalone-collector.jar"',
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
        <Bash lines={[`docker login containers.instana.io --username _ --password ${agentKey}`]} />

        <Spacer />

        <Description
          lines={[
            t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheCloudRunServiceRevision')
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
            'COPY --from=instana/google-cloud-run-nodejs:latest /instana /instana\n',
            'RUN /instana/setup.sh',
            'ENV NODE_OPTIONS="--require /instana/node_modules/@instana/google-cloud-run"',
            '',
            '# Other stuff in your Docker image'
          ]}
        />

        <Spacer />

        <Description
          lines={[
            t('in-waiting-for-deployment:content.setTheFollowingEnvironmentVariablesInTheCloudRunServiceRevision')
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
      </Fragment>
    );
  }

  let runtimeSelection;

  if (selectedInstallationMethod === installationMethods[0]) {
    runtimeSelection = (
      <Fragment>
        <Row>
          {t('in-waiting-for-deployment:content.selectYourApplicationRuntime')}
          <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
        </Row>
      </Fragment>
    );
  } else {
    runtimeSelection = <Fragment />;
  }

  return (
    <>
      <HelpBox>
        <Description
          lines={[
            t(
              'in-waiting-for-deployment:content.supportForGoogleCloudRunIsDesignedToWorkWithTheFullyManagedGoogleCloudRunPlatformCloudRunOnAnthosGkeIsCurrentlyNotSupported'
            )
          ]}
        />
      </HelpBox>

      <HelpBox>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.makeSureYouHaveAnInstanaAgentSetUpToMonitorYourGcpProjectForDetailsOnSettingUpTheInstanaAgentForGcpReferToThe'
          )}
          linkText={t('in-waiting-for-deployment:content.instanaGcpSupportDocumentation')}
          href="https://instana.com/docs/ecosystem/gcp"
        />
      </HelpBox>

      <Spacer />

      <Row>
        {t('in-waiting-for-deployment:content.selectTheInstallationMethod')}
        <DropDown value={selectedInstallationMethod} options={installationMethods} onChange={setInstallationMethod} />
      </Row>

      <Spacer />

      {runtimeSelection}

      <Spacer />

      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.integrateTheInstanaInProcessCollectorForGoogleCloudRunAsDescribedBelowMoreDetailsAreAvailableInThe'
        )}
        linkText={t('in-waiting-for-deployment:content.documentationForGoogleCloudRun')}
        href="https://instana.com/docs/ecosystem/google-cloud-run"
      />
      <Spacer />

      {steps}
    </>
  );
}

function K8sHelmChartContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: "Cluster name, e.g., 'prod'",
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input
              id="zone-name"
              value={zoneName}
              onChange={onZoneNameChange}
              placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
            />
          </Row>
          <Bash
            disabledErrorMessage={clusterNameValidationMessage}
            lines={[
              'helm install instana-agent \\',
              '--repo https://agents.instana.io/helm \\',
              '--namespace instana-agent \\',
              '--create-namespace \\',
              `--set agent.key=${agentKey} \\`,
              `--set agent.endpointHost=${agentEndpoint} \\`,
              `--set agent.endpointPort=${agentEndpointPort} \\`,
              `--set cluster.name='${clusterName}' \\`,
              `--set zone.name='${zoneName}' \\`,
              'instana-agent'
            ]}
          />
          <Spacer />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.helmVersion3IsRequiredForMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/kubernetes/"
              linkText={t('in-waiting-for-deployment:content.instanaKubernetesDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function K8sDaemonSetContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: t('in-waiting-for-deployment:content.clusterNameEGProd'),
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input
              id="zone-name"
              value={zoneName}
              onChange={onZoneNameChange}
              placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
            />
          </Row>
          <YAMLFile
            title={t('in-waiting-for-deployment:content.instanaAgent')}
            disabledErrorMessage={clusterNameValidationMessage}
            content={getKubernetesYamlConfig(
              agentKey,
              agentEndpoint,
              agentEndpointPort,
              clusterName,
              zoneName,
              instanaAgentYaml
            )}
          />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.forMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/kubernetes/"
              linkText={t('in-waiting-for-deployment:content.instanaKubernetesDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function OpenShiftDaemonSetContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: t('in-waiting-for-deployment:content.clusterNameEGProd'),
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input
              id="zone-name"
              value={zoneName}
              onChange={onZoneNameChange}
              placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
            />
          </Row>
          <YAMLFile
            title="instana-agent.yaml"
            disabledErrorMessage={clusterNameValidationMessage}
            content={getKubernetesYamlConfig(
              agentKey,
              agentEndpoint,
              agentEndpointPort,
              clusterName,
              zoneName,
              instanaAgentOpenShiftYaml
            )}
          />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.forMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/openshift/"
              linkText={t('in-waiting-for-deployment:content.instanaOpenShiftDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function OpenShiftHelmContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: t('in-waiting-for-deployment:content.clusterNameEGProd'),
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input
              id="zone-name"
              value={zoneName}
              onChange={onZoneNameChange}
              placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
            />
          </Row>
          <Bash
            disabledErrorMessage={clusterNameValidationMessage}
            lines={[
              'helm install instana-agent \\',
              '--repo https://agents.instana.io/helm \\',
              '--namespace instana-agent \\',
              '--create-namespace \\',
              '--set openshift=true \\',
              `--set agent.key=${agentKey} \\`,
              `--set agent.endpointHost=${agentEndpoint} \\`,
              `--set agent.endpointPort=${agentEndpointPort} \\`,
              `--set cluster.name='${clusterName}' \\`,
              `--set zone.name='${zoneName}' \\`,
              'instana-agent'
            ]}
          />
          <Spacer />
          <HelpBox>
            <TextWithLink
              text={t('in-waiting-for-deployment:content.helmVersion3IsRequiredForMoreInformationVisitThe')}
              href="https://instana.com/docs/ecosystem/openshift/"
              linkText={t('in-waiting-for-deployment:content.instanaOpenShiftDocumentation')}
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function K8sOperatorContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.installingTheInstanaAgentUsingTheKubernetesOperatorIsDescribedIn')}
        href="https://instana.com/docs/setup_and_manage/host_agent/on/kubernetes/#install-using-the-operator"
        linkText={t('in-waiting-for-deployment:content.theInstanaKubernetesDocumentation')}
      />
      <Spacer />
      <TextWithLink
        text={t('in-waiting-for-deployment:content.theFollowingConfigurationValuesWillBeNeededToBePopulatedInThe')}
        href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
        linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServiceEndpoint')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServicePort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaApplicationKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourKubernetesCluster')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.youWillAlsoWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevUsingTheClusterNameOptionInThe'
          )}
          href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
          linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
        />
      </HelpBox>
    </>
  );
}

function OpenShiftOperatorContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.installingTheInstanaAgentUsingTheOpenShiftOperatorIsDescribedIn')}
        href="https://instana.com/docs/setup_and_manage/host_agent/on/openshift/#install-using-the-operator"
        linkText={t('in-waiting-for-deployment:content.theInstanaOpenShiftDocumentation')}
      />
      <Spacer />
      <TextWithLink
        text={t('in-waiting-for-deployment:content.theFollowingConfigurationValuesWillBeNeededToBePopulatedInThe')}
        href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
        linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServiceEndpoint')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaServicePort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaApplicationKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.nameYourOpenShiftCluster')}>
        <TextWithLink
          text={t(
            'in-waiting-for-deployment:content.youWillAlsoWantToProvideADescriptiveNameForYourClusterLikeProdEuOrDevUsingTheClusterNameOptionInThe'
          )}
          href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
          linkText={t('in-waiting-for-deployment:content.instanaAgentCustomResourceFile')}
        />
      </HelpBox>
    </>
  );
}

function CfAndBoshContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <ValidatedInputFields
        fields={[
          {
            name: 'agentReleaseVersion',
            placeholder: "Release version, e.g. '0.0.1'",
            validate: {
              validator: validateAgentReleaseVersion,
              validationMessage: t(
                'in-waiting-for-deployment:content.theAgentReleaseVersionMustBeAValidSemanticVersion'
              )
            }
          },
          {
            name: 'foundationName',
            placeholder: "Foundation name, e.g., 'prod'",
            validate: {
              validator: validateClusterName,
              validationMessage: t(
                'in-waiting-for-deployment:content.theFoundationNameMustBeACombinationOfLettersDashesAndUnderscoresUpTo64CharactersLong'
              )
            }
          },
          {
            name: 'clientId',
            placeholder: "UAA client id, e.g., 'my-client-id'",
            validate: {
              validator: validateNotEmpty,
              validationMessage: t('in-waiting-for-deployment:content.theUaaClientIdCannotBeBlank')
            }
          },
          {
            name: 'clientSecret',
            placeholder: "UAA client secret, e.g., 'my-client-secret'",
            validate: {
              validator: validateNotEmpty,
              validationMessage: t('in-waiting-for-deployment:content.theUaaClientSecretCannotBeBlank')
            }
          }
        ]}
        renderContent={({
          foundationName,
          foundationNameInput,
          foundationNameValidationMessage,
          agentReleaseVersion,
          agentReleaseVersionInput,
          agentReleaseVersionValidationMessage,
          clientId,
          clientIdInput,
          clientIdValidationMessage,
          clientSecret,
          clientSecretInput,
          clientSecretValidationMessage
        }) => (
          <>
            <HelpBox title={t('in-waiting-for-deployment:content.supportedStemcells')}>
              <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial']} />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.instanaBoshAgentVersion')}>
              <Description
                lines={[t('in-waiting-for-deployment:content.pleaseProvideTheInstanaBoshReleaseVersionYouWantToUse')]}
              />
              <Row>{agentReleaseVersionInput}</Row>
            </HelpBox>
            <HelpBox title={t('in-waiting-for-deployment:content.uploadTheInstanaBoshReleasesToTheBoshDirector')}>
              <Description lines={[t('in-waiting-for-deployment:content.downloadTheFollowingBoshReleases')]} />
              <DownloadButton
                title={t('in-waiting-for-deployment:content.downloadInstanaAgentRelease')}
                href={`https://_:${agentKey}@artifact-public.instana.io/artifactory/shared/com/instana/bosh/agent-bosh/${agentReleaseVersion}/agent-bosh-${agentReleaseVersion}.tar.gz`}
              />
              <DownloadButton
                title={t('in-waiting-for-deployment:content.downloadInstanaLeadershipElectionRelease')}
                href={`https://_:${agentKey}@artifact-public.instana.io/artifactory/shared/com/instana/bosh/leadership-election/${agentReleaseVersion}/leadership-election-${agentReleaseVersion}.tar.gz`}
              />
              <Spacer />
              <Description
                lines={[t('in-waiting-for-deployment:content.uploadTheInstanaBoshReleasesToYourBoshDirector')]}
              />
              <Bash
                lines={[
                  `bosh upload-release agent-bosh-${agentReleaseVersion}.tar.gz`,
                  `bosh upload-release leadership-election-${agentReleaseVersion}.tar.gz`
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.createTheInstanaUaaClient')}>
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.createInTheFoundationSUserAccountAndAuthenticationUaaAClientWithCloudControllerAdminReadOnlyAuthority'
                  )
                ]}
              />
              <Row>
                {clientIdInput}
                {clientSecretInput}
              </Row>
              <TextWithLink
                text={t('in-waiting-for-deployment:content.theEasiestWayToCreateTheRequiredUaaClientIsToUseThe')}
                linkText={t('in-waiting-for-deployment:content.uaacTool')}
                href="https://github.com/cloudfoundry/cf-uaac"
              />
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.replaceInTheCommandsBelowUaaApiEndpointWithYourUaaApiEndpointAndClientsAdminSecretWithYourUaaClientWithClientsAdminOrClientsWriteAuthority'
                  )
                ]}
              />
              <Bash
                lines={[
                  'uaac target <uaa-api-endpoint>',
                  'uaac token client get -s <clients.admin-secret>',
                  `uaac client add '${clientId}' \\`,
                  "  --name 'Instana Cloud Foundry Client' \\",
                  '  --autoapprove true \\',
                  '  --authorized_grant_types client_credentials \\',
                  "  --authorities 'cloud_controller.admin_read_only' \\",
                  `  --secret '${clientSecret}' \\`
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.instanaBoshAddon')}>
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.boshAddonsAreRuntimeConfigurationsForBoshThatAllowYouToDeclareAdditionalJobsToBeRunInYourDeploymentsForMoreInformationOnBoshRuntimeConfigurationsAndAddonsReferToThe'
                )}
                linkText={t('in-waiting-for-deployment:content.boshRuntimeConfigurationsDocumentation')}
                href="https://bosh.io/docs/runtime-config/"
              />
              <Spacer />
              <Description lines={[t('in-waiting-for-deployment:content.pickANameForYourCloudFoundryFoundation')]} />
              <Row>{foundationNameInput}</Row>
              <Spacer />
              <Description
                lines={[
                  t('in-waiting-for-deployment:content.applyTheFollowingAsBoshRuntimeConfigurationsToYourBoshDirector')
                ]}
              />
              <Row>
                <YAMLFile
                  title={t('in-waiting-for-deployment:content.runtimeConfigYml')}
                  disabledErrorMessage={
                    foundationNameValidationMessage ||
                    agentReleaseVersionValidationMessage ||
                    clientIdValidationMessage ||
                    clientSecretValidationMessage
                  }
                  content={
                    `releases:\n- name: instana-agent\n  version: ${agentReleaseVersion}\n` +
                    `- name: instana-leadership-election\n  version: ${agentReleaseVersion}\n` +
                    'addons:\n' +
                    '- name: instana-agent\n  jobs:\n  - name: instana-agent\n' +
                    '    release: instana-agent\n  properties:\n    tanzu:\n      foundation:\n' +
                    `        id: '${foundationName}'\n` +
                    `        name: '${foundationName}'\n` +
                    '    instana:\n      agent:\n' +
                    `        mode: APM\n        key: '${agentKey}'\n        endpoint: '${agentEndpoint}'\n` +
                    `        zone: '${foundationName}'\n` +
                    '- name: instana-cloudfoundry-sensor\n' +
                    '  jobs:\n' +
                    '  - name: instana-agent-configuration-cf-sensor\n' +
                    '    release: instana-agent\n' +
                    '    properties:\n' +
                    '      tanzu:\n' +
                    '        foundation:\n' +
                    `          id: '${foundationName}'\n` +
                    `          name: '${foundationName}'\n` +
                    '      cf:\n' +
                    '        uaa:\n' +
                    `          client: '${clientId}'\n` +
                    `          client_secret: '${clientSecret}'\n` +
                    '  - name: instana-leadership-election\n' +
                    '    release: instana-leadership-election\n' +
                    '- name: instana-agent-configuration-pxc-mysql\n  jobs:\n  - name: instana-agent-configuration-pxc-mysql\n' +
                    '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                    '    - name: pxc-mysql\n      release: pxc\n'
                  }
                />
              </Row>
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.forMoreInformationOnHowToSetUpBoshRuntimeConfigurationsReferToThe'
                )}
                linkText={t('in-waiting-for-deployment:content.applyingTheInstanaAgentRuntimeConfigurationsPage')}
                href="https://instana.com/docs/setup_and_manage/host_agent/on/cloud-foundry#applying-the-instana-agent-runtime-configurations"
              />
            </HelpBox>
            <Spacer />
            <HelpBox title={t('in-waiting-for-deployment:content.dynamicAgentsProxiesAndOtherSettings')}>
              <Description
                lines={[
                  t(
                    'in-waiting-for-deployment:content.theBoshReleaseWillByDefaultInstallStaticHostAgentsButItCanBeConfigureToInstallDynamicHostAgentsInstead'
                  ),
                  t(
                    'in-waiting-for-deployment:content.similarlyTheBoshReleaseCanBeConfiguredSoThatTheInstalledHostAgentsWillTalkToTheInstanaBackendOverAProxy'
                  )
                ]}
              />
              <TextWithLink
                text={t(
                  'in-waiting-for-deployment:content.forMoreInformationOnHostConfigurationsThatYouCanApplyOverTheInstanaAgentBoshReleaseConsultThe'
                )}
                href="https://instana.com/docs/ecosystem/cloudfoundry/"
                linkText={t('in-waiting-for-deployment:content.instanaCloudFoundryDocumentation')}
              />
            </HelpBox>
          </>
        )}
      />
    </>
  );
}

function PcfContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text={t('in-waiting-for-deployment:content.downloadTheInstanaMicroservicesApplicationMonitoringTileFrom')}
        href="https://network.pivotal.io/products/instana-microservices-application-monitoring"
        linkText={t('in-waiting-for-deployment:content.vMwareTanzuNetwork')}
      />
      <Spacer />
      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.uploadTheInstanaMicroservicesApplicationMonitoringTileToYourOpsManagerAsDescribedInThe'
        )}
        href="https://docs.pivotal.io/partners/instana/installing.html"
        linkText={t('in-waiting-for-deployment:content.instanaTileDocumentationOnVMwareTanzuNetwork')}
      />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.theFollowingConfigurationsHaveToBeAppliedToTheBackendConfigurationTabOfTheInstanaMicroservicesApplicationMonitoringTileInOpsManager'
          )
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.endpointHost')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.endpointPort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.agentKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.finallyYouWillNeedToGiveYourVMwareTanzuFoundationANameForExampleProdEuOrDev01ViaTheAgentZoneSettingInTheAgentConfigurationTab'
          )
        ]}
      />
      <TextWithLink
        text={t(
          'in-waiting-for-deployment:content.applyTheChangesIntroducedByTheInstanaMicroservicesApplicationMonitoringTileToAllTilesInTheOpsManagerTilesThatAreNotSelectedForTheApplyChangesStepInOpsManagerWillNotBeVisibleInInstana'
        )}
      />
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedOpsManagerVersions')}>
        <Listing items={['2.3+']} />
      </HelpBox>
      <Spacer />
      <HelpBox title={t('in-waiting-for-deployment:content.supportedStemcells')}>
        <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial']} />
      </HelpBox>
    </>
  );
}

function PackagesContent({ agentKey }) {
  return (
    <>
      <Description
        lines={[
          t('in-waiting-for-deployment:content.weMakeAvailableRegularlyUpdatedRpmAndDebPackagesAtTheFollowingAddress')
        ]}
      />
      <Script lines={[`https://_:${agentKey}@packages.instana.io/agent/download`]} />
    </>
  );
}

function WindowsInstallerContent({ agentKey, agentEndpoint, agentEndpointPort, butlerDomain, tenant, tenantUnit }) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>
      <Row>
        <DownloadButton
          title={t('in-waiting-for-deployment:content.download')}
          href={getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            `exe64${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
              agentMode === agentModeOptions[0] ? '' : 'offline'
            }`,
            butlerDomain
          )}
        />
      </Row>
      <Spacer />
      <Description
        lines={[
          t('in-waiting-for-deployment:content.launchTheInstallerAsAnApplicationAndSupplyTheFollowingConfiguration')
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaBackendAddress')]} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaBackendPort')]} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={[t('in-waiting-for-deployment:content.instanaAgentKey')]} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
    </>
  );
}

function WindowsInstallerUnattendedContent({
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  butlerDomain,
  tenant,
  tenantUnit
}) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  return (
    <>
      <Row>
        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentModeLabel')}</h4>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeDynamic')}
              checked={agentMode === agentModeOptions[0]}
              onChange={() => setAgentMode(agentModeOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label={t('in-waiting-for-deployment:content.agentModeStatic')}
              checked={agentMode === agentModeOptions[1]}
              onChange={() => setAgentMode(agentModeOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>

        <Fragment>
          <h4>{t('in-waiting-for-deployment:content.agentRuntimeLabel')}</h4>
          <p>
            <CheckboxFancy
              label="Azul Zulu 1.8"
              checked={jvmVendor === jvmVendorOptions[0]}
              onChange={() => setJVMVendor(jvmVendorOptions[0])}
              size="default"
              asRadioButton
            />
          </p>
          <p>
            <CheckboxFancy
              label="Eclipse OpenJ9 11"
              checked={jvmVendor === jvmVendorOptions[1]}
              onChange={() => setJVMVendor(jvmVendorOptions[1])}
              size="default"
              asRadioButton
            />
          </p>
        </Fragment>
      </Row>

      <Description
        lines={[t('in-waiting-for-deployment:content.theLatestWindowsInstaller64BitIsAvailableAtTheFollowingAddress')]}
      />
      <Script
        lines={[
          getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            `exe64${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
              agentMode === agentModeOptions[0] ? '' : 'offline'
            }`,
            butlerDomain
          )
        ]}
      />
      <Spacer />
      <Description
        lines={[
          t(
            'in-waiting-for-deployment:content.theFollowingCommandLineInstallationWillInstallTheInstanaAgentWithoutOpeningTheInstallerSUserInterface'
          )
        ]}
      />
      <Cmd
        lines={[
          `AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} /quiet`
        ]}
      />
    </>
  );
}

function ManualLinuxContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'linux64', label: t('in-waiting-for-deployment:content.linux64Bit') },
    { key: 'linux32', label: t('in-waiting-for-deployment:content.linux32Bit') },
    { key: 'linuxarm64', label: t('in-waiting-for-deployment:content.linux64BitArm') },
    { key: 'linuxarm32', label: t('in-waiting-for-deployment:content.linux32BitArm') },
    { key: 'linuxppc64', label: t('in-waiting-for-deployment:content.linux64BitPowerPc') },
    { key: 'linuxppc32', label: t('in-waiting-for-deployment:content.linux32BitPowerPc') },
    { key: 'linuxppcle64', label: t('in-waiting-for-deployment:content.linux64BitPowerPcLittleEndian') },
    { key: 'linuxs390x', label: t('in-waiting-for-deployment:content.linuxS390X') }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.azulZuluJdk8Preferred'),
            t('in-waiting-for-deployment:content.oracleHotspotJdk8'),
            t('in-waiting-for-deployment:content.ibmJ98'),
            t('in-waiting-for-deployment:content.openJdk8'),
            t('in-waiting-for-deployment:content.amazonCorrettoJdk8')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost'),
            t(
              'in-waiting-for-deployment:content.toExtractMakeSureToUseAGnuTarThatIsCapableOfExtractingPathsLongerThan100Characters'
            )
          ]}
        />
      </HelpBox>
    </>
  );
}

function ManualMacOsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [{ key: 'mac', label: t('in-waiting-for-deployment:content.macOs64BitIntel') }];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.azulZuluJdk8Preferred'),
            t('in-waiting-for-deployment:content.oracleHotspotJdk8'),
            t('in-waiting-for-deployment:content.ibmJ98'),
            t('in-waiting-for-deployment:content.openJdk8'),
            t('in-waiting-for-deployment:content.amazonCorrettoJdk8')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost')
          ]}
        />
      </HelpBox>
    </>
  );
}

function ManualUnixContent({ agentKey, butlerDomain, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'sparc64', label: t('in-waiting-for-deployment:content.solaris64BitSparc') },
    { key: 'sparc32', label: t('in-waiting-for-deployment:content.solaris32BitSparc') },
    { key: 'aix64', label: t('in-waiting-for-deployment:content.aix64BitPowerPc') },
    { key: 'aix32', label: t('in-waiting-for-deployment:content.aix32BitPowerPc') }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.azulZuluJdk8Preferred'),
            t('in-waiting-for-deployment:content.oracleHotspotJdk8'),
            t('in-waiting-for-deployment:content.ibmJ98'),
            t('in-waiting-for-deployment:content.openJdk8'),
            t('in-waiting-for-deployment:content.amazonCorrettoJdk8')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost'),
            t(
              'in-waiting-for-deployment:content.toExtractMakeSureToUseAGnuTarThatIsCapableOfExtractingPathsLongerThan100Characters'
            )
          ]}
        />
      </HelpBox>
    </>
  );
}

function ManualWindowsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'win64', label: t('in-waiting-for-deployment:content.windowsZip64Bit') },
    { key: 'win32', label: t('in-waiting-for-deployment:content.windowsZip32Bit') },
    { key: 'win64offline', label: t('in-waiting-for-deployment:content.windowsZip64BitStatic') },
    { key: 'win32offline', label: t('in-waiting-for-deployment:content.windowsZip32BitStatic') }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title={t('in-waiting-for-deployment:content.requiresAJava8Runtime')}>
        <Listing
          items={[
            t('in-waiting-for-deployment:content.azulZuluJdk8Preferred'),
            t('in-waiting-for-deployment:content.oracleHotspotJdk8'),
            t('in-waiting-for-deployment:content.ibmJ98'),
            t('in-waiting-for-deployment:content.openJdk8'),
            t('in-waiting-for-deployment:content.amazonCorrettoJdk8')
          ]}
        />
        <Spacer />
        <Description
          lines={[
            t('in-waiting-for-deployment:content.weRecommendToUseAJdkFromTheSameVendorAsMonitoredJvMsOnTheSameHost')
          ]}
        />
      </HelpBox>
    </>
  );
}

function getKubernetesYamlConfig(agentKey, agentEndpoint, agentEndpointPort, clusterName, zoneName, yamlConfig) {
  return yamlConfig
    .replace('${agentKey}', btoa(agentKey))
    .replace('${agentEndpoint}', agentEndpoint)
    .replace('${agentEndpointPort}', agentEndpointPort)
    .replace('${clusterName}', clusterName)
    .replace('${zoneName}', zoneName);
}
