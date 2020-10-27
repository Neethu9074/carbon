import React, { Fragment, useState } from 'react';

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
import { Col, Row as GridRow } from 'in-new-components/layout/Grid';

const maxClusterNameRegex = new RegExp(/^[\w-_]{1,20}$/);

function validateClusterName(clusterName) {
  return maxClusterNameRegex.test(clusterName);
}

const clusterNameValidator = {
  validator: validateClusterName,
  validationMessage:
    'The cluster name must be a combination of letters, dashes and underscores, up to 20 characters long'
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
      label: 'AWS',
      icon: 'lib_aws',
      fullLabel: 'Amazon Web Services',
      category: 'Platform',
      subTechnologies: [
        {
          label: 'Instana AWS Sensor',
          keyWords: 'aws',
          Content: AwsSensorContent
        },
        {
          label: 'Elastic Computing (EC2) - Linux',
          keyWords: 'elasticcomputeec2linux',
          Content: ElasticComputingLinuxContent
        },
        {
          label: 'Elastic Computing (EC2) - Windows 64Bit',
          keyWords: 'elasticcomputeec2windows',
          Content: ElasticComputingWindowsContent
        },
        {
          label: 'Elastic Container Service for Kubernetes (EKS)',
          keyWords: 'elasticcontainerkubernetesk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'AWS Fargate',
          keyWords: 'awsfargate',
          Content: AWSFargateContent
        },
        {
          label: 'AWS Lambda',
          keyWords: 'awslambda',
          Content: AWSLambdaContent
        }
      ].filter(subTechnology => (disableAwsSensorDocumentation ? subTechnology.label !== 'Instana AWS Sensor' : true))
    },
    {
      label: 'Azure',
      icon: 'lib_azure',
      fullLabel: 'Microsoft Azure',
      category: 'Platform',
      subTechnologies: [
        {
          label: 'Azure Kubernetes Service (AKS)',
          keyWords: 'azurekubernetesk8s',
          Content: K8sDaemonSetContent
        }
      ]
    },
    {
      label: 'Google Cloud',
      icon: 'lib_google_cloud',
      fullLabel: 'Google Cloud Platform',
      category: 'Platform',
      subTechnologies: [
        {
          label: 'Google Compute Engine (GCE) - Linux',
          keyWords: 'googlecloudplatformcomputeenginelinuxgce',
          Content: GoogleComputeEngineContent
        },
        {
          label: 'Google Kubernetes Engine (GKE)',
          keyWords: 'googlekubernetesenginegkek8s',
          Content: K8sGoogleKubernetesEngineContent
        }
      ]
    },
    {
      label: 'Docker',
      icon: 'lib_container_docker',
      category: 'Platform',
      keyWords: 'dockercontainer',
      Content: DockerContent
    },
    {
      label: 'Kubernetes',
      icon: 'lib_kubernetes',
      category: 'Platform',
      subTechnologies: [
        {
          label: 'Helm chart',
          keyWords: 'kuberneteshelmchartk8s',
          Content: K8sHelmChartContent
        },
        {
          label: 'DaemonSet',
          keyWords: 'kubernetesdeamonsetk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'Operator',
          keywords: 'kubernetesoperatork8s',
          Content: K8sOperatorContent
        },
        {
          label: 'Azure Kubernetes Service (AKS)',
          keyWords: 'azurekubernetesserviceaksk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'AWS Elastic Kubernetes Service (EKS)',
          keyWords: 'awselastickubernetesserviceeksk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'Google Kubernetes Engine (GKE)',
          keyWords: 'googlekubernetesenginegkek8s',
          Content: K8sGoogleKubernetesEngineContent
        }
      ]
    },
    {
      label: 'OpenShift',
      icon: 'lib_openshift',
      category: 'Platform',
      subTechnologies: [
        {
          label: 'DaemonSet',
          keyWords: 'kubernetesdeamonsetk8s',
          Content: OpenShiftDaemonSetContent
        },
        {
          label: 'Operator',
          keywords: 'kubernetesoperatork8s',
          Content: OpenShiftOperatorContent
        }
      ]
    },
    {
      label: 'Cloud Foundry and BOSH',
      fullLabel: 'Cloud Foundry and other BOSH-based deployments',
      icon: 'lib_cloudfoundry',
      category: 'Platform',
      keyWords: 'cloudfoundryboshcf',
      Content: CfAndBoshContent
    },
    {
      label: 'VMware Tanzu',
      icon: 'lib_vmware_tanzu',
      fullLabel: 'VMware Tanzu (formerly known as Pivotal Cloud Foundry)',
      category: 'Platform',
      keyWords: 'pivotalplatformpivotalcloudfoundrypcf',
      Content: PcfContent
    },
    {
      label: 'Linux',
      icon: 'lib_linux',
      category: 'OS',
      subTechnologies: [
        {
          label: 'Automatic Installation (One-liner)',
          keyWords: 'linuxautomaticoneliner',
          Content: OneLinerContent
        },
        {
          label: 'Packages (DEB, RPM)',
          keyWords: 'linuxpackagesdebrpm',
          Content: PackagesContent
        },
        {
          label: 'Archive (tar.gz)',
          keyWords: 'linuxmanualtarball',
          Content: ManualLinuxContent
        },
        {
          label: 'AWS Elastic Computing (EC2)',
          keyWords: 'linuxawselasticcomputingec2',
          Content: ElasticComputingLinuxContent
        },
        {
          label: 'Google Compute Engine (GCE)',
          keyWords: 'linuxgooglecomputeenginegce',
          Content: GoogleComputeEngineContent
        }
      ]
    },
    {
      label: 'Mac OS',
      category: 'OS',
      keyWords: 'macosx',
      icon: 'lib_apple',
      Content: ManualMacOsContent
    },
    {
      label: 'Unix',
      category: 'OS',
      keyWords: 'unixtarball',
      icon: 'lib_unix',
      Content: ManualUnixContent
    },
    {
      label: 'Windows',
      icon: 'lib_windows',
      category: 'OS',
      subTechnologies: [
        {
          label: 'Windows Installer 64Bit',
          keyWords: 'windowsexe',
          Content: WindowsInstallerContent
        },
        {
          label: 'Windows Installer 64Bit (Unattended)',
          keyWords: 'windowsexe',
          Content: WindowsInstallerUnattendedContent
        },
        {
          label: 'ZIP Archives',
          keyWords: 'windowszip',
          Content: ManualWindowsContent
        },
        {
          label: 'Elastic Computing (EC2) - Windows 64Bit',
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
      <JSONFile title="IAM permissions" content={JSON.stringify(permissions, 0, 2)} />
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
        <Description
          lines={[
            'We advise to run the Instana AWS sensor on a dedicated EC2, "Current Generation General Purpose" Linux Virtual Machine. The m4.large instances, for example, are perfectly suited to the task.',
            'Use the following as "User Data" when spinning up the dedicated EC2 Virtual Machine.'
          ]}
        />
        <Bash
          lines={[
            'curl -o setup_agent.sh https://setup.instana.io/agent',
            'chmod 700 ./setup_agent.sh',
            `sudo ./setup_agent.sh -y -a ${agentKey} -m aws -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s`
          ]}
        />
        <Spacer />
        <HelpBox title="User Data in AWS EC2">
          <TextWithLink
            text="For more information on how to use the script above with User Data in AWS EC2, refer to the "
            linkText='"Running Commands on Your Linux Instance at Launch" page.'
            href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
          />
        </HelpBox>
        <Spacer />
        <Description lines={['The AWS Agent needs the following IAM permissions:']} />
        {iamPermissions}
        <Spacer />
        <Description
          lines={[
            'The IAM role containing the permissions above needs to be able to perform the "AssumeRole" action, so, make sure to edit the "Trust Relationship" with something like the following:'
          ]}
        />
        <JSONFile title="Trust Relationship" content={JSON.stringify(trustRelationship, 0, 2)} />
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
        <HelpBox title="ECS supported runtimes">
          <Description
            lines={[
              'The AWS Agent can run on both ECS on EC2 and Fargate on ECS using the ECS platforms version 1.3 and version 1.4.'
            ]}
          />
        </HelpBox>
        <Spacer />
        <Description lines={['Create an ECS Task Definition using this template:']} />
        <JSONFile title="Task Definition" content={JSON.stringify(taskDefinition, 0, 2)} />
        <Spacer />
        <Description
          lines={['Assign to the ECS Task Definition a role with at least the following IAM permissions:']}
        />
        {iamPermissions}
        <Spacer />
        <HelpBox title="ECS Service Definition">
          <Description
            lines={[
              'Create a service using the above Task Definition and run only one instance to avoid unnecessary charges for the CloudWatch API.'
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
          text="The AWS Agent monitors lots of different AWS technologies in one single package. For the full list, refer to the "
          linkText="supported AWS Services list."
          href="https://www.instana.com/docs/ecosystem/aws/#monitored-services"
        />
      </HelpBox>

      <Spacer />

      <Row>
        Run your AWS Agent on:
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
          text="The support for Go on Fargate on ECS works the same way as with any Go application. Follow the instructions of the "
          linkText="Go documentation."
          href="https://www.instana.com/docs/ecosystem/go"
        />
        <Spacer />
        <Description lines={['Set the following environment variables in the ECS Task Definition:']} />
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
          lines={['Add the following lines to your Docker file before the ENTRYPOINT or the last CMD command:']}
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
          lines={['The Docker build process needs to log into containers.instana.io using the following credentials:']}
        />
        <Bash lines={[`docker login containers.instana.io --username _ --password ${agentKey}`]} />

        <Spacer />

        <Description lines={['Set the following environment variables in the ECS Task Definition:']} />
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
        Linux base image: &nbsp;
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
        <Description lines={['Set the following environment variables in the ECS Task Definition:']} />
        <Spacer />
        Your application directory in the container (you usually set this as the WORKDIR directory in the Dockerfile):
        <Spacer />
        <Input id="app-dir" value={appDirName} onChange={setAppDirName} placeholder="Application directory" />
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
          lines={['Add the following lines to your Docker file before the ENTRYPOINT or the last CMD command:']}
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

        <Description lines={['Set the following environment variables in the ECS Task Definition:']} />
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
          text="The support for Python on Fargate on ECS works the same way as with any Python application. Follow the instructions of the "
          linkText="Python documentation."
          href="https://www.instana.com/docs/ecosystem/python"
        />
        <Spacer />
        <Description lines={['Set the following environment variables in the ECS Task Definition:']} />
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
            'Support for AWS Fargate is designed to work with AWS Fargate on the Elastic Container Service (ECS).'
          ]}
        />
      </HelpBox>

      <Spacer />

      <Row>
        Select your application runtime:
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <Spacer />

      {steps}
    </>
  );
}

function AWSLambdaContent({ agentKey, serverlessEndpoint }) {
  const runtimeOptions = ['Node.js 10.x or newer', 'Node.js 8.x', 'Python 2.7 and 3.x'];
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

  if (selectedRuntime === runtimeOptions[0]) {
    const nodejsLayerVersion = '31';

    steps = (
      <Fragment>
        <HelpBox title="Configuring Your AWS Lambda Function">
          <Description
            lines={[
              'The preferred way to configure AWS Lambda functions based on Node.js 10.x (or newer) for tracing is the Instana Lambda layer with AutoTrace.',
              'There a number of ways to configure this:'
            ]}
          />
          <Listing
            items={[
              'AWS Web Console',
              'AWS Command Line Interface',
              'AWS Serverless Application Model (AWS SAM)',
              'Your preferred tool to manage AWS Lambda functions'
            ]}
          />
        </HelpBox>
        <HelpBox title="AWS Web Console">
          <TextWithLink
            text="A detailed guide (including screenshots) on how to configure your Lambda function for AutoTrace using the AWS Web Console can be found in our "
            linkText="documentation for Lambda AutoTrace"
            href="https://www.instana.com/docs/ecosystem/aws-lambda/#autotrace-aws-lambdas"
          />
          <Description lines={['In short, the steps are as follows']} />
          <GridRow>
            <Col xs={6}>
              Select your AWS region:
              <Spacer />
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              Current Lambda Handler:
              <Spacer />
              <Input
                id="lambda-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder="Your Current Lambda Handler"
              />
            </Col>
          </GridRow>
          <Spacer />
          <Listing
            items={[
              <Fragment>
                Add the Instana Lambda layer with the ARN
                <Spacer />
                <Script
                  lines={[`arn:aws:lambda:${awsRegion}:410797082306:layer:instana-nodejs:${nodejsLayerVersion}`]}
                />
                (
                <TextWithLink
                  text="See"
                  linkText="AWS docs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )<Spacer />
              </Fragment>,
              <Fragment>
                <Spacer />
                Set Instana auto-wrap handler as the handler for your Lambda function.
                <Spacer />
                <Script lines={['instana-aws-lambda-auto-wrap.handler']} />(
                <TextWithLink
                  text="See"
                  linkText="AWS docs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </Fragment>,
              <Fragment>
                <Spacer />
                Set the following environment variables in your Lambda function:
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

        <HelpBox title="AWS Command Line Interface">
          <Description
            lines={[
              'To use the AWS Command Line Interface, please provide the following values and use a command similar to the one below:'
            ]}
          />
        </HelpBox>
        <GridRow>
          <Col xs={3}>
            Select your AWS region:
            <Spacer />
            <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
          </Col>
          <Col xs={3}>
            Lambda Function Name:
            <Spacer />
            <Input
              id="lambda-function-name"
              value={lambdaFunctionName}
              onChange={setLambdaFunctionName}
              placeholder="The name of your Lambda function"
            />
          </Col>
          <Col xs={3}>
            Current Lambda Handler (optional):
            <Spacer />
            <Input
              id="current-lambda-function-handler"
              value={lambdaHandler}
              onChange={setHandler}
              placeholder="Your Current Lambda Handler"
            />
          </Col>
        </GridRow>
        <Bash
          lines={[
            '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
            '# Instead, use this as a template to define your own aws cli command.',
            `aws --region ${awsRegion} lambda update-function-configuration \\`,
            `   --function-name ${lambdaFunctionName} \\`,
            `   --layers arn:aws:lambda:${awsRegion}:410797082306:layer:instana-nodejs:${nodejsLayerVersion} \\`,
            '   --handler instana-aws-lambda-auto-wrap.handler',
            `   --environment "Variables={${
              lambdaHandler === 'index.handler' ? '' : `LAMBDA_HANLDER=${lambdaHandler}, `
            }INSTANA_ENDPOINT_URL=${serverlessEndpoint}, INSTANA_AGENT_KEY=${agentKey} }"`
          ]}
        />
      </Fragment>
    );
  } else if (selectedRuntime === runtimeOptions[1]) {
    steps = (
      <TextWithLink
        text="The preferred way to configure AWS Lambda functions based on Node.js 8.x is to use the "
        linkText="Instana Lambda layer with manual wrapping."
        href="https://www.instana.com/docs/ecosystem/aws-lambda#manual-wrapping"
      />
    );
  } else if (selectedRuntime === runtimeOptions[2]) {
    const pythonLayerVersion = '12';

    steps = (
      <Fragment>
        <HelpBox title="Configuring Your AWS Lambda Function">
          <Description
            lines={[
              'The preferred way to configure AWS Lambda functions based on Python for tracing is the Instana Lambda layer with AutoTrace.',
              'There a number of ways to configure this:'
            ]}
          />
          <Listing
            items={[
              'AWS Web Console',
              'AWS Command Line Interface',
              'AWS Serverless Application Model (AWS SAM)',
              'Your preferred tool to manage AWS Lambda functions'
            ]}
          />
        </HelpBox>
        <HelpBox title="AWS Web Console">
          <TextWithLink
            text="A detailed guide (including screenshots) on how to configure your Lambda function for AutoTrace using the AWS Web Console can be found in our "
            linkText="documentation for Lambda AutoTrace"
            href="https://www.instana.com/docs/ecosystem/aws-lambda#instana-autotrace"
          />
          <Description lines={['In short, the steps are as follows']} />
          <GridRow>
            <Col xs={6}>
              Select your AWS region:&nbsp;
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              Current Lambda Handler:&nbsp;
              <Input
                id="lambda-handler"
                value={lambdaHandler}
                onChange={setHandler}
                placeholder="Your Current Lambda Handler"
              />
            </Col>
          </GridRow>
          <Listing
            items={[
              <Fragment>
                Add the Instana Lambda layer with the ARN
                <Script
                  lines={[`arn:aws:lambda:${awsRegion}:410797082306:layer:instana-python:${pythonLayerVersion}`]}
                />
                (
                <TextWithLink
                  text="See"
                  linkText="AWS docs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </Fragment>,
              <Fragment>
                Set Instana auto-wrap handler as the handler for your Lambda function.
                <Script lines={['instana.lambda_handler']} />(
                <TextWithLink
                  text="See"
                  linkText="AWS docs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html"
                />
                )
              </Fragment>,
              <Fragment>
                Set the following environment variables in your Lambda function:
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

        <HelpBox title="AWS Command Line Interface">
          <Description
            lines={[
              'To use the AWS Command Line Interface, please provide the following values and use a command similar to the one below:'
            ]}
          />
        </HelpBox>
        <GridRow>
          <Col xs={3}>
            Select your AWS region:
            <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
          </Col>
          <Col xs={3}>
            Lambda Function Name:
            <Input
              id="lambda-function-name"
              value={lambdaFunctionName}
              onChange={setLambdaFunctionName}
              placeholder="The name of your Lambda function"
            />
          </Col>
          <Col xs={3}>
            Current Lambda Handler (optional):
            <Input
              id="current-lambda-function-handler"
              value={lambdaHandler}
              onChange={setHandler}
              placeholder="Your Current Lambda Handler"
            />
          </Col>
        </GridRow>
        <Bash
          lines={[
            '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
            '# Instead, use this as a template to define your own aws cli command.',
            `aws --region ${awsRegion} lambda update-function-configuration \\`,
            `   --function-name ${lambdaFunctionName} \\`,
            `   --layers arn:aws:lambda:${awsRegion}:410797082306:layer:instana-python:${pythonLayerVersion} \\`,
            '   --handler instana.lambda_handler',
            `   --environment "Variables={${
              lambdaHandler === 'index.handler' ? '' : `LAMBDA_HANLDER=${lambdaHandler}, `
            }INSTANA_ENDPOINT_URL=${serverlessEndpoint}, INSTANA_AGENT_KEY=${agentKey} }"`
          ]}
        />
      </Fragment>
    );
  }

  return (
    <>
      <Row>
        Select your Lambda runtime:
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <TextWithLink
        text="Make sure you have an Instana AWS Sensor running in your AWS region. For details on setting up the Instana AWS Sensor, refer to the "
        linkText="AWS Service documentation."
        href="https://www.instana.com/docs/ecosystem/aws"
      />
      <Spacer />

      <TextWithLink
        text="Next, configure your AWS Lambda functions for native tracing as described in the steps below. Other options to set up native Lambda tracing and more details about this feature are available in the"
        linkText="documentation."
        href="https://www.instana.com/docs/ecosystem/aws-lambda"
      />
      <Spacer />

      {steps}
    </>
  );
}

function ElasticComputingWindowsContent({ agentKey, agentEndpoint, agentEndpointPort, tenant, tenantUnit }) {
  const agentModeOptions = ['Dynamic agent', 'Static agent'];
  const [agentMode, setMode] = useState(agentModeOptions[0]);

  return (
    <>
      <Row>
        <DropDown value={agentMode} options={agentModeOptions} onChange={setMode} />
      </Row>
      <Spacer />
      <Description lines={['Use the following script as "User Data" for the EC2 instance:']} />
      <PowershellEC2
        lines={[
          `Invoke-WebRequest -OutFile "$env:TEMP\\AgentBootstrap.exe" -Uri "https://instana.io/assets/agent/${tenant}/${tenantUnit}?agentKey=${agentKey}&type=exe64"`,
          `Invoke-Expression -Command "$env:TEMP\\AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} /quiet"`
        ]}
      />
      <Description
        lines={[
          'The "User Data" script above will download the host agent, install it on the virtual machine as a Windows Service and then automatically start it.'
        ]}
      />
      <Spacer />
      <HelpBox title="User Data in AWS EC2">
        <TextWithLink
          text="For more information on how to use the script above with User Data in AWS EC2, refer to the "
          linkText='"Running commands on your Windows instance at launch" page.'
          href="https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-windows-user-data.html#user-data-scripts"
        />
      </HelpBox>
    </>
  );
}

function ElasticComputingLinuxContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <Description lines={['Use the following script as "User Data" for the EC2 instance:']} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s -y`
        ]}
      />
      <Spacer />
      <HelpBox title="User Data in AWS EC2">
        <TextWithLink
          text="For more information on how to use the script above with User Data in AWS EC2, refer to the "
          linkText='"Running Commands on Your Linux Instance at Launch" page.'
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
      <Input id="zone-name" value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
      <Bash lines={lines} />
    </>
  );
}

function OneLinerContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const jvmModeOptions = ['Dynamic agent with Zulu JVM', 'Static agent with Zulu JVM'];
  const [jvmMode, setMode] = useState(jvmModeOptions[0]);

  const installModeOptions = ['Interactive installation', 'Silent installation'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const [isService, setIsService] = useState(false);

  return (
    <>
      <Row>
        <DropDown value={jvmMode} options={jvmModeOptions} onChange={setMode} />
        <DropDown value={installMode} options={installModeOptions} onChange={setInstallMode} />
      </Row>
      <CheckBox
        label="Install and start as service (only supported for SystemD-based systems)"
        checked={isService}
        setChecked={setIsService}
      />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t ${
            jvmMode === jvmModeOptions[0] ? 'dynamic' : 'static'
          } -e ${agentEndpoint}:${agentEndpointPort} ${installMode === installModeOptions[0] ? '' : '-y'} ${
            isService ? '-s' : ''
          }`
        ]}
      />
      <Spacer />
      <HelpBox title="Supported Operating Systems">
        <Listing
          items={[
            'Ubuntu Linux (14.04 / 16.04 / 18.04 / 20.04)',
            'CentOS (6 / 7 / 8)',
            'Debian (9 / 10)',
            'Suse Linux Enterprise Server (SLES) (12)',
            'Redhat Enterprise Linux (RHEL) (6 / 7 / 8)',
            'Amazon Linux (1 / 2)'
          ]}
        />
      </HelpBox>
    </>
  );
}

function GoogleComputeEngineContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <Description lines={['Use the following script as "Startup Script" for the GCE instance:']} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo apt-get install apt-transport-https ca-certificates && sudo ./setup_agent.sh -a ${agentKey} -t dynamic -e ${agentEndpoint}:${agentEndpointPort} -s -y`
        ]}
      />
      <Spacer />
      <HelpBox title="Startup Scripts in Google Compute Engine">
        <TextWithLink
          text="For more information on how to use the script above as a startup script in GCE, refer to the "
          linkText='"Running startup scripts" page.'
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
        text="Installing the Instana agent on Google Kubernetes Engine is integrated in the"
        href="https://console.cloud.google.com/marketplace/details/instana-public/instana?q=instana"
        linkText="Google Cloud Marketplace."
      />
      <Spacer />
      <Description
        lines={[
          'Click on "Configure" and select the Organization or Project containing the Kubernetes Cluster you want to deploy Instana to. The following configurations have to be applied during the "Configure" step in the Google Cloud Platform console.'
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Instana Service Endpoint']} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Service port']} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Application Key']} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title="Name your GKE cluster">
        <Description
          lines={[
            'You likely want to provide a descriptive name for your cluster, like "prod-eu" or "dev", rather than the default "kubernetes-cluster" via the "Instana Zone" setting in the "Configure" step.'
          ]}
        />
      </HelpBox>
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
            <Input id="zone-name" value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
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
              text="These instructions are for Helm Version 3. For more information visit the"
              href="https://www.instana.com/docs/ecosystem/kubernetes/"
              linkText="Instana Kubernetes documentation."
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
          placeholder: "Cluster name, e.g., 'prod'",
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input id="zone-name" value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
          </Row>
          <YAMLFile
            title="daemonset.yaml"
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
              text="For more information visit the"
              href="https://www.instana.com/docs/ecosystem/kubernetes/"
              linkText="Instana Kubernetes documentation."
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
          placeholder: "Cluster name, e.g., 'prod'",
          validate: clusterNameValidator
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input id="zone-name" value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
          </Row>
          <YAMLFile
            title="daemonset.yaml"
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
              text="For more information visit the"
              href="https://www.instana.com/docs/ecosystem/openshift/"
              linkText="Instana OpenShift documentation."
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
        text="Installing the Instana agent using the Kubernetes operator is described in"
        href="https://www.instana.com/docs/setup_and_manage/host_agent/on/kubernetes/#install-using-the-operator"
        linkText="the Instana Kubernetes documentation."
      />
      <Spacer />
      <TextWithLink
        text="The following configuration values will be needed to be populated in the"
        href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
        linkText="Instana agent custom resource file"
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Instana Service Endpoint']} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Service port']} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Application Key']} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title="Name your Kubernetes cluster">
        <TextWithLink
          text="You will also want to provide a descriptive name for your cluster, like 'prod-eu' or 'dev' using the 'cluster.name' option in the"
          href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
          linkText="Instana agent custom resource file"
        />
      </HelpBox>
    </>
  );
}

function OpenShiftOperatorContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  return (
    <>
      <TextWithLink
        text="Installing the Instana agent using the OpenShift operator is described in"
        href="https://www.instana.com/docs/setup_and_manage/host_agent/on/openshift/#install-using-the-operator"
        linkText="the Instana OpenShift documentation."
      />
      <Spacer />
      <TextWithLink
        text="The following configuration values will be needed to be populated in the"
        href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
        linkText="Instana agent custom resource file"
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Instana Service Endpoint']} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Service port']} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Application Key']} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <HelpBox title="Name your OpenShift cluster">
        <TextWithLink
          text="You will also want to provide a descriptive name for your cluster, like 'prod-eu' or 'dev' using the 'cluster.name' option in the"
          href="https://github.com/instana/instana-agent-operator/blob/master/deploy/instana-agent.customresource.yaml"
          linkText="Instana agent custom resource file"
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
              validationMessage: 'The agent release version must be a valid semantic version'
            }
          },
          {
            name: 'foundationName',
            placeholder: "Foundation name, e.g., 'prod'",
            validate: {
              validator: validateClusterName,
              validationMessage:
                'The foundation name must be a combination of letters, dashes and underscores, up to 20 characters long'
            }
          },
          {
            name: 'clientId',
            placeholder: "UAA client id, e.g., 'my-client-id'",
            validate: {
              validator: validateNotEmpty,
              validationMessage: 'The UAA client id cannot be blank'
            }
          },
          {
            name: 'clientSecret',
            placeholder: "UAA client secret, e.g., 'my-client-secret'",
            validate: {
              validator: validateNotEmpty,
              validationMessage: 'The UAA client secret cannot be blank'
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
            <HelpBox title="Supported Stemcells">
              <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial']} />
            </HelpBox>
            <Spacer />
            <HelpBox title="Instana BOSH agent version">
              <Description lines={['Please provide the Instana BOSH release version you want to use:']} />
              <Row>{agentReleaseVersionInput}</Row>
            </HelpBox>
            <HelpBox title="Upload the Instana BOSH releases to the BOSH director">
              <Description lines={['Download the following BOSH releases']} />
              <DownloadButton
                title="Download 'instana-agent' release"
                href={`https://_:${agentKey}@artifact-public.instana.io/artifactory/shared/com/instana/bosh/agent-bosh/${agentReleaseVersion}/agent-bosh-${agentReleaseVersion}.tar.gz`}
              />
              <DownloadButton
                title="Download 'instana-leadership-election' release"
                href={`https://_:${agentKey}@artifact-public.instana.io/artifactory/shared/com/instana/bosh/leadership-election/${agentReleaseVersion}/leadership-election-${agentReleaseVersion}.tar.gz`}
              />
              <Spacer />
              <Description lines={['Upload the Instana BOSH releases to your BOSH director']} />
              <Bash
                lines={[
                  `bosh upload-release agent-bosh-${agentReleaseVersion}.tar.gz`,
                  `bosh upload-release leadership-election-${agentReleaseVersion}.tar.gz`
                ]}
              />
            </HelpBox>
            <Spacer />
            <HelpBox title="Create the Instana UAA client">
              <Description
                lines={[
                  "Create in the foundation's User Account and Authentication (UAA), a client with 'cloud_controller.admin_read_only' authority:"
                ]}
              />
              <Row>
                {clientIdInput}
                {clientSecretInput}
              </Row>
              <TextWithLink
                text="The easiest way to create the required UAA client, is to use the "
                linkText="uaac tool."
                href="https://github.com/cloudfoundry/cf-uaac"
              />
              <Description
                lines={[
                  "Replace in the commands below '<uaa-api-endpoint>' with your UAA API endpoint and '<clients.admin-secret>' with your UAA client with 'clients.admin' or 'clients.write' authority"
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
            <HelpBox title="Instana BOSH addon">
              <TextWithLink
                text="BOSH addons are runtime configurations for BOSH that allow you to declare additional jobs to be run in your deployments. For more information on BOSH runtime configurations and addons, refer to the "
                linkText='"BOSH Runtime Configurations" documentation.'
                href="https://bosh.io/docs/runtime-config/"
              />
              <Spacer />
              <Description lines={['Pick a name for your Cloud Foundry foundation:']} />
              <Row>{foundationNameInput}</Row>
              <Spacer />
              <Description lines={['Apply the following as BOSH runtime configurations to your BOSH director:']} />
              <Row>
                <YAMLFile
                  title="runtime-config.yml"
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
                text="For more information on how to set up BOSH runtime configurations, refer to the "
                linkText='"Applying the Instana agent runtime configurations" page.'
                href="https://www.instana.com/docs/setup_and_manage/host_agent/on/cloud-foundry#applying-the-instana-agent-runtime-configurations"
              />
            </HelpBox>
            <Spacer />
            <HelpBox title="Dynamic agents, proxies and other settings">
              <Description
                lines={[
                  'The BOSH release will by default install static host agents, but it can be configure to install dynamic host agents instead.',
                  'Similarly, the BOSH release can be configured so that the installed host agents will talk to the Instana backend over a proxy.'
                ]}
              />
              <TextWithLink
                text="For more information on host configurations that you can apply over the 'instana-agent' BOSH release, consult the "
                href="https://www.instana.com/docs/ecosystem/cloudfoundry/"
                linkText="Instana Cloud Foundry documentation."
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
        text='Download the "Instana Microservices Application Monitoring" tile from '
        href="https://network.pivotal.io/products/instana-microservices-application-monitoring"
        linkText="VMware Tanzu Network."
      />
      <Spacer />
      <TextWithLink
        text='Upload the "Instana Microservices Application Monitoring" tile to your Ops Manager as described in the'
        href="https://docs.pivotal.io/partners/instana/installing.html"
        linkText="Instana tile documentation on VMware Tanzu Network."
      />
      <Description
        lines={[
          'The following configurations have to be applied to the "Backend configuration" tab of the "Instana Microservices Application Monitoring" tile in Ops Manager.'
        ]}
      />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Endpoint host']} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Endpoint port']} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Agent key']} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <Description
        lines={[
          'Finally, you will need to give your VMware Tanzu foundation a name, for example "prod-eu" or "dev01", via the Agent Zone setting in the Agent Configuration tab.'
        ]}
      />
      <TextWithLink text='Apply the changes introduced by the "Instana Microservices Application Monitoring" tile to all tiles in the Ops Manager. Tiles that are not selected for the "Apply changes" step in Ops Manager will not be visible in Instana.' />
      <Spacer />
      <HelpBox title="Supported Ops Manager versions">
        <Listing items={['2.3+']} />
      </HelpBox>
      <Spacer />
      <HelpBox title="Supported Stemcells">
        <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial']} />
      </HelpBox>
    </>
  );
}

function PackagesContent({ agentKey }) {
  return (
    <>
      <Description lines={['We make available regularly-updated RPM and DEB packages at the following address']} />
      <Script lines={[`https://_:${agentKey}@packages.instana.io/agent/download`]} />
    </>
  );
}

function WindowsInstallerContent({ agentKey, agentEndpoint, agentEndpointPort, butlerDomain, tenant, tenantUnit }) {
  const agentModeOptions = ['Dynamic agent', 'Static agent'];
  const [agentMode, setMode] = useState(agentModeOptions[0]);

  return (
    <>
      <Row>
        <DropDown value={agentMode} options={agentModeOptions} onChange={setMode} />
        <DownloadButton
          title="Download"
          href={getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            agentMode === agentModeOptions[0] ? 'exe64' : 'exe64offline',
            butlerDomain
          )}
        />
      </Row>
      <Spacer />
      <Description lines={['Launch the installer as an application and supply the following configuration:']} />
      <Spacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Instana Backend Address']} />
          <Script lines={[agentEndpoint]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Backend Port']} />
          <Script lines={[agentEndpointPort]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Instana Agent key']} />
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
  const agentModeOptions = ['Dynamic agent', 'Static agent'];
  const [agentMode, setMode] = useState(agentModeOptions[0]);

  return (
    <>
      <Row>
        <DropDown value={agentMode} options={agentModeOptions} onChange={setMode} />
      </Row>

      <Description lines={['The latest Windows installer (64Bit) is available at the following address:']} />
      <Script
        lines={[
          getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            agentMode === agentModeOptions[0] ? 'exe64' : 'exe64offline',
            butlerDomain
          )
        ]}
      />
      <Spacer />
      <Description
        lines={[
          "The following command line installation will Install the Instana agent without opening the installer's user interface:"
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
    { key: 'linux64', label: 'Linux (64Bit)' },
    { key: 'linux32', label: 'Linux (32Bit)' },
    { key: 'linuxarm64', label: 'Linux (64Bit - ARM)' },
    { key: 'linuxarm32', label: 'Linux (32Bit - ARM)' },
    { key: 'linuxppc64', label: 'Linux (64Bit - PowerPC)' },
    { key: 'linuxppc32', label: 'Linux (32Bit - PowerPC)' },
    { key: 'linuxppcle64', label: 'Linux (64Bit - PowerPC Little Endian)' },
    { key: 'linuxs390x', label: 'Linux (s390x)' }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title="Requires a Java 8 Runtime">
        <Listing
          items={[
            'Azul Zulu JDK 8 (Preferred)',
            'Oracle Hotspot JDK 8',
            'IBM J9 8',
            'OpenJDK 8',
            'Amazon Corretto JDK 8'
          ]}
        />
        <Spacer />
        <Description
          lines={[
            'We recommend to use a JDK from the same vendor as monitored JVMs on the same host.',
            'To extract make sure to use a GNU tar that is capable of extracting paths longer than 100 characters.'
          ]}
        />
      </HelpBox>
    </>
  );
}

function ManualMacOsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [{ key: 'mac', label: 'Mac OS (64bit - Intel)' }];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title="Requires a Java 8 Runtime">
        <Listing
          items={[
            'Azul Zulu JDK 8 (Preferred)',
            'Oracle Hotspot JDK 8',
            'IBM J9 8',
            'OpenJDK 8',
            'Amazon Corretto JDK 8'
          ]}
        />
        <Spacer />
        <Description lines={['We recommend to use a JDK from the same vendor as monitored JVMs on the same host.']} />
      </HelpBox>
    </>
  );
}

function ManualUnixContent({ agentKey, butlerDomain, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'sparc64', label: 'Solaris (64bit - SPARC)' },
    { key: 'sparc32', label: 'Solaris (32bit - SPARC)' },
    { key: 'aix64', label: 'AIX (64bit - PowerPC)' },
    { key: 'aix32', label: 'AIX (32bit - PowerPC)' }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title="Requires a Java 8 Runtime">
        <Listing
          items={[
            'Azul Zulu JDK 8 (Preferred)',
            'Oracle Hotspot JDK 8',
            'IBM J9 8',
            'OpenJDK 8',
            'Amazon Corretto JDK 8'
          ]}
        />
        <Spacer />
        <Description
          lines={[
            'We recommend to use a JDK from the same vendor as monitored JVMs on the same host.',
            'To extract make sure to use a GNU tar that is capable of extracting paths longer than 100 characters.'
          ]}
        />
      </HelpBox>
    </>
  );
}

function ManualWindowsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'win64', label: 'Windows Zip (64bit)' },
    { key: 'win32', label: 'Windows Zip (32bit)' },
    { key: 'win64offline', label: 'Windows Zip (64bit, static)' },
    { key: 'win32offline', label: 'Windows Zip (32bit, static)' }
  ];
  const [option, setOption] = useState(agentOptions[0].key);

  return (
    <>
      <Row>
        <DropDown value={option} options={agentOptions} onChange={setOption} />
        <DownloadButton href={getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain)} />
      </Row>
      <HelpBox title="Requires a Java 8 Runtime">
        <Listing
          items={[
            'Azul Zulu JDK 8 (Preferred)',
            'Oracle Hotspot JDK 8',
            'IBM J9 8',
            'OpenJDK 8',
            'Amazon Corretto JDK 8'
          ]}
        />
        <Spacer />
        <Description lines={['We recommend to use a JDK from the same vendor as monitored JVMs on the same host.']} />
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
