import React, { Fragment, useState } from 'react';

import {
  Bash,
  CheckBox,
  Description,
  DownloadButton,
  DropDown,
  getAgentDownloadURL,
  HelpBox,
  Input,
  JSON,
  Listing,
  Row,
  Script,
  Spacer,
  TextWithLink,
  toURLstring,
  ValidatedInputFields,
  YAML
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-new-components/layout/Grid';

const maxClusterNameRegex = new RegExp(/^[\w-_]{1,20}$/);

function validateClusterName(clusterName) {
  return maxClusterNameRegex.test(clusterName);
}

const agentReleaseVersionRegex = new RegExp(/^instana-agent-\d\.\d{1,3}\.\d+$/);

function validateAgentReleaseVersion(agentReleaseVersion) {
  return agentReleaseVersionRegex.test(agentReleaseVersion);
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
          label: 'Elastic Computing (EC2) - Windows',
          keyWords: 'elasticcomputeec2windows',
          Content: WindowsInstallerContent
        },
        {
          label: 'Elastic Container Service for Kubernetes (EKS)',
          keyWords: 'elasticcontainerkubernetesk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'AWS Lambda Native Tracing',
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
          label: 'DaemonSet',
          keyWords: 'kubernetesdeamonsetk8s',
          Content: K8sDaemonSetContent
        },
        {
          label: 'Helm chart',
          keyWords: 'kuberneteshelmchartk8s',
          Content: K8sHelmChartContent
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
      label: 'Cloud Foundry and BOSH',
      fullLabel: 'Cloud Foundry and other BOSH-based deployments',
      icon: 'lib_cloudfoundry',
      category: 'Platform',
      keyWords: 'cloudfoundryboshcf',
      Content: CfAndBoshContent
    },
    {
      label: 'Pivotal Platform',
      icon: 'lib_pivotal_platform',
      fullLabel: 'Pivotal Platform (formerly known as Pivotal Cloud Foundry)',
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
          label: 'Static tarballs',
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
          label: 'Windows Installer',
          keyWords: 'windowsexe',
          Content: WindowsInstallerContent
        },
        {
          label: 'ZIP Archives',
          keyWords: 'windowszip',
          Content: ManualWindowsContent
        }
      ]
    }
  ];
}

function AwsSensorContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <HelpBox>
        <TextWithLink
          text="The Instana AWS Agent monitors lots of different AWS technologies in one single package. For the full list, refer to the "
          linkText="supported AWS Services list."
          href="https://docs.instana.io/ecosystem/aws/#aws-services"
        />
      </HelpBox>
      <Spacer />
      <Description
        lines={[
          'Use the following as "User Data" when spinning up a dedicated EC2 Virtual Machine. We advise to run the Instana AWS sensor on an "Current Generation General Purpose" machine running Linux. The m4.large instances, for example, are perfectly suited to the task. Please take note of the "-m aws" switch in the following command line.'
        ]}
      />
      <Bash
        lines={[
          'curl -o setup_agent.sh https://setup.instana.io/agent',
          'chmod 700 ./setup_agent.sh',
          `sudo ./setup_agent.sh -a ${agentKey} -m aws -t dynamic -e ${agentEndpoint}:443 -s`
        ]}
      />
      <Spacer />
      <Description lines={['The EC2 Virtual Machine running the Instana AWS Sensor needs the following IAM Roles.']} />
      <JSON
        content={
          '{\n  "Version": "2012-10-17",\n  "Statement": [{\n' +
          '    "Action": [\n' +
          '      "elasticbeanstalk:DescribeEnvironments",\n' +
          '      "elasticbeanstalk:ListTagsForResource",\n' +
          '      "elasticbeanstalk:DescribeInstancesHealth",\n' +
          '      "dynamodb:ListTables",\n' +
          '      "dynamodb:DescribeTable",\n' +
          '      "dynamodb:ListTagsOfResource",\n' +
          '      "rds:DescribeDBInstances",\n' +
          '      "rds:DescribeEvents",\n' +
          '      "rds:ListTagsForResource",\n' +
          '      "sqs:ListQueues",\n' +
          '      "sqs:GetQueueAttributes",\n' +
          '      "sqs:ListQueueTags",\n' +
          '      "elasticache:ListTagsForResource",\n' +
          '      "elasticache:DescribeCacheClusters",\n' +
          '      "elasticache:DescribeEvents",\n' +
          '      "elasticloadbalancing:DescribeLoadBalancers",\n' +
          '      "elasticloadbalancing:DescribeTags",\n' +
          '      "elasticmapreduce:ListClusters",\n' +
          '      "elasticmapreduce:DescribeCluster",\n' +
          '      "es:ListDomainNames",\n' +
          '      "es:DescribeElasticsearchDomain",\n' +
          '      "es:ListTags",\n' +
          '      "ec2:DescribeInstances",\n' +
          '      "ec2:DescribeTags",\n' +
          '      "ec2:DescribeVolumes",\n' +
          '      "kinesis:ListStreams",\n' +
          '      "kinesis:DescribeStream",\n' +
          '      "kinesis:ListTagsForStream",\n' +
          '      "lambda:ListTags",\n' +
          '      "lambda:ListFunctions",\n' +
          '      "lambda:ListVersionsByFunction",\n' +
          '      "lambda:ListEventSourceMappings",\n' +
          '      "lambda:GetFunctionConfiguration",\n' +
          '      "mq:ListBrokers",\n' +
          '      "mq:DescribeBroker",\n' +
          '      "s3:GetBucketTagging",\n' +
          '      "s3:ListAllMyBuckets",\n' +
          '      "s3:GetBucketLocation",\n' +
          '      "xray:BatchGetTraces",\n' +
          '      "xray:GetTraceSummaries",\n' +
          '      "tag:GetResources"\n' +
          '    ],\n' +
          '    "Effect": "Allow",\n' +
          '    "Resource": "*"\n' +
          '  },{\n' +
          '    "Action": [\n' +
          '      "cloudwatch:GetMetricStatistics",\n' +
          '      "cloudwatch:GetMetricData",\n' +
          '      "cloudwatch:ListMetrics"\n' +
          '    ],\n' +
          '    "Effect": "Allow",\n' +
          '    "Resource": "*"\n' +
          '  }]\n' +
          '}\n'
        }
      />
      <Spacer />
      <Description
        lines={[
          'The role above needs to be able to perform the "AssumeRole" action, so, make sure to edit the "Trust Relationship" with something like the following:'
        ]}
      />
      <JSON
        content={
          '{\n' +
          '  "Version": "2012-10-17",\n' +
          '  "Statement": [{\n' +
          '    "Effect": "Allow",\n' +
          '    "Principal": {\n' +
          '      "Service": "ec2.amazonaws.com"\n' +
          '    },\n' +
          '    "Action": "sts:AssumeRole"\n' +
          '  }]\n' +
          '}\n'
        }
      />
      <Spacer />
      <HelpBox title="User Data in AWS EC2">
        <TextWithLink
          text="For more information on how to use the script above with User Data in AWS EC2, refer to the "
          linkText="&quot;Running Commands on Your Linux Instance at Launch&quot; page."
          href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
        />
      </HelpBox>
    </>
  );
}

function AWSLambdaContent({ agentKey, agentEndpoint }) {
  const endpoint = agentEndpoint.includes('-eu-') ? 'eu-west-1' : 'us-west-2';
  const runtimeOptions = ['Node.js 10.x or newer', 'Node.js 8.x'];
  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);
  const awsRegionOptions = [
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
  const layerVersion = '19';

  let steps;

  if (selectedRuntime === runtimeOptions[1]) {
    steps = (
      <TextWithLink
        text="The preferred way to configure AWS Lambda functions based on Node.js 8.x is to use the "
        linkText="Instana Lambda layer with manual wrapping."
        href="https://docs.instana.io/ecosystem/aws-lambda-native-tracing/#instana-lambda-layer--manual-wrapping"
      />
    );
  } else {
    steps = (
      <Fragment>
        <HelpBox title="Configuring Your AWS Lambda Function">
          <Description
            lines={[
              'The preferred way to configure AWS Lambda functions based on Node.js 10.x (or newer) for native tracing is the Instana Lambda layer with AutoTrace.',
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
            href="https://docs.instana.io/ecosystem/aws-lambda-native-tracing/#autotrace-aws-lambdas"
          />
          <Description lines={['In short, the steps are as follows']} />
          <GridRow>
            <Col xs={6}>
              Select your AWS region:&nbsp;
              <DropDown value={awsRegion} options={awsRegionOptions} onChange={setAwsRegion} />
            </Col>
            <Col xs={6}>
              Current Lambda Handler:&nbsp;
              <Input value={lambdaHandler} onChange={setHandler} placeholder="Your Current Lambda Handler" />
            </Col>
          </GridRow>
          <Listing
            items={[
              <Fragment>
                Add the Instana Lambda layer with the ARN
                <Script lines={[`arn:aws:lambda:${awsRegion}:410797082306:layer:instana:${layerVersion}`]} />(
                <TextWithLink
                  text="See"
                  linkText="AWS docs"
                  href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html"
                />
                )
              </Fragment>,
              <Fragment>
                Set Instana auto-wrap handler as the handler for your Lambda function.
                <Script lines={['instana-aws-lambda-auto-wrap.handler']} />(
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
                    <Script lines={[`https://serverless-${endpoint}.instana.io/`]} />
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
              value={lambdaFunctionName}
              onChange={setLambdaFunctionName}
              placeholder="The name of your Lambda function"
            />
          </Col>
          <Col xs={3}>
            Current Lambda Handler (optional):
            <Input value={lambdaHandler} onChange={setHandler} placeholder="Your Current Lambda Handler" />
          </Col>
        </GridRow>
        <Bash
          lines={[
            '# Do not copy and paste this verbatim! It will overwrite any previously defined collection of layers and environment variables.',
            '# Instead, use this as a template to define your own aws cli command.',
            `aws --region ${awsRegion} lambda update-function-configuration \\`,
            `   --function-name ${lambdaFunctionName} \\`,
            `   --layers arn:aws:lambda:${awsRegion}:410797082306:layer:instana:${layerVersion} \\`,
            '   --handler instana-aws-lambda-auto-wrap.handler',
            `   --environment "Variables={${
              lambdaHandler === 'index.handler' ? '' : `LAMBDA_HANLDER=${lambdaHandler}, `
            }INSTANA_ENDPOINT_URL=https://serverless-${endpoint}.instana.io/, INSTANA_AGENT_KEY=${agentKey} }"`
          ]}
        />
      </Fragment>
    );
  }

  return (
    <>
      <HelpBox title="Supported AWS Lambda Runtimes">
        <Description
          lines={[
            'Instana currently supports native tracing of AWS Lambda functions based on the Node.js runtime (for Node.js 8.x and newer).'
          ]}
        />
      </HelpBox>
      <Row>
        Select your Lambda runtime:
        <DropDown value={selectedRuntime} options={runtimeOptions} onChange={setRuntime} />
      </Row>

      <TextWithLink
        text="Make sure you have an Instana AWS Sensor running in your AWS region. For details on setting up the Instana AWS Sensor, refer to the "
        linkText="AWS Service documentation."
        href="https://docs.instana.io/ecosystem/aws"
      />
      <Spacer />

      <TextWithLink
        text="Next, configure your AWS Lambda functions for native tracing as described in the steps below. Other options to set up native Lambda tracing and more details about this feature are available in the"
        linkText="documentation."
        href="https://docs.instana.io/ecosystem/aws-lambda-native-tracing/"
      />
      <Spacer />

      {steps}
    </>
  );
}

function ElasticComputingLinuxContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <Description lines={['Use the following script as "User Data" for the EC2 instance:']} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t dynamic -e ${agentEndpoint}:443 -s -y`
        ]}
      />
      <Spacer />
      <HelpBox title="User Data in AWS EC2">
        <TextWithLink
          text="For more information on how to use the script above with User Data in AWS EC2, refer to the "
          linkText="&quot;Running Commands on Your Linux Instance at Launch&quot; page."
          href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
        />
      </HelpBox>
    </>
  );
}

function DockerContent({ agentKey, agentEndpoint }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <>
      <Input value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
      <Bash
        lines={[
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
          '--env="INSTANA_AGENT_ENDPOINT_PORT=443" \\',
          `--env="INSTANA_AGENT_KEY=${agentKey}" \\`,
          `--env="INSTANA_AGENT_ZONE='${zoneName}'" \\`,
          'instana/agent'
        ]}
      />
    </>
  );
}

function OneLinerContent({ agentKey, agentEndpoint }) {
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
          } -e ${agentEndpoint}:443 ${installMode === installModeOptions[0] ? '' : '-y'} ${isService ? '-s' : ''}`
        ]}
      />
      <Spacer />
      <HelpBox title="Supported Operating Systems">
        <Listing
          items={[
            'Ubuntu Linux (14.04 / 16.04 / 18.04)',
            'CentOS (6 / 7)',
            'Debian (8 / 9)',
            'Suse Linux Enterprise Server (SLES) (12)',
            'Redhat Enterprise Linux (RHEL) (6 / 7 / 8)',
            'Amazon Linux (1 / 2)'
          ]}
        />
      </HelpBox>
    </>
  );
}

function GoogleComputeEngineContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <Description lines={['Use the following script as "Startup Script" for the GCE instance:']} />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo apt-get install apt-transport-https ca-certificates && sudo ./setup_agent.sh -a ${agentKey} -t dynamic -e ${agentEndpoint}:443 -s -y && sudo apt-get purge -y apt-transport-https ca-certificates`
        ]}
      />
      <Spacer />
      <HelpBox title="Startup Scripts in Google Compute Engine">
        <TextWithLink
          text="For more information on how to use the script above as a startup script in GCE, refer to the "
          linkText="&quot;Running startup scripts&quot; page."
          href="https://cloud.google.com/compute/docs/startupscript"
        />
      </HelpBox>
    </>
  );
}

function K8sGoogleKubernetesEngineContent({ agentKey, agentEndpoint }) {
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
          <Script lines={[`443`]} />
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

function K8sHelmChartContent({ agentKey, agentEndpoint }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: "Cluster name, e.g., 'prod'",
          validate: { validator: validateClusterName, validationMessage: 'The cluster name is invalid' }
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
          </Row>
          <Bash
            disabledErrorMessage={clusterNameValidationMessage}
            lines={[
              'helm install --name instana-agent --namespace instana-agent \\',
              `--set agent.key=${agentKey} \\`,
              `--set agent.endpointHost=${agentEndpoint} \\`,
              '--set agent.endpointPort=443 \\',
              `--set cluster.name='${clusterName}' \\`,
              `--set zone.name='${zoneName}' \\`,
              'stable/instana-agent'
            ]}
          />
          <Spacer />
          <HelpBox>
            <TextWithLink
              text="For more information visit the"
              href="https://docs.instana.io/quick_start/agent_setup/container/kubernetes/"
              linkText="Instana Kubernetes documentation."
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function K8sDaemonSetContent({ agentKey, agentEndpoint }) {
  const [zoneName, onZoneNameChange] = useState('');

  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'clusterName',
          placeholder: "Cluster name, e.g., 'prod'",
          validate: { validator: validateClusterName, validationMessage: 'The cluster name is invalid' }
        }
      ]}
      renderContent={({ clusterName, clusterNameInput, clusterNameValidationMessage }) => (
        <>
          <Row>
            {clusterNameInput}
            <Input value={zoneName} onChange={onZoneNameChange} placeholder="Agent zone (Optional)" />
          </Row>
          <YAML
            title="daemonset.yaml"
            disabledErrorMessage={clusterNameValidationMessage}
            content={getKubernetesYamlConfig(agentKey, agentEndpoint, clusterName, zoneName)}
          />
          <HelpBox>
            <TextWithLink
              text="For more information visit the"
              href="https://docs.instana.io/quick_start/agent_setup/container/kubernetes/"
              linkText="Instana Kubernetes documentation."
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function CfAndBoshContent({ agentKey, agentEndpoint }) {
  return (
    <ValidatedInputFields
      fields={[
        {
          name: 'foundationName',
          placeholder: "Foundation name, e.g., 'prod'",
          validate: { validator: validateClusterName, validationMessage: 'The foundation name is invalid' }
        },
        {
          name: 'agentReleaseVersion',
          placeholder: "Agent release, e.g. 'instana-agent-0.0.1'",
          validate: {
            validator: validateAgentReleaseVersion,
            validationMessage: 'The agent release version is invalid'
          }
        }
      ]}
      renderContent={({
        foundationName,
        foundationNameInput,
        foundationNameValidationMessage,
        agentReleaseVersion,
        agentReleaseVersionInput,
        agentReleaseVersionValidationMessage
      }) => (
        <>
          <Description lines={['Apply the following as BOSH runtime configuration to your BOSH director:']} />
          <Row>
            {foundationNameInput}
            {agentReleaseVersionInput}
          </Row>
          <Row>
            <YAML
              title="runtime-config.yml"
              disabledErrorMessage={foundationNameValidationMessage || agentReleaseVersionValidationMessage}
              content={
                `releases:\n- name: instana-agent\n  version: ${agentReleaseVersion}\n\naddons:\n` +
                '- name: instana-agent\n  jobs:\n  - name: instana-agent\n' +
                `    release: instana-agent\n  properties:\n    instana:\n      agent:\n` +
                `        mode: APM\n        key: ${agentKey}\n        endpoint: ${agentEndpoint}\n` +
                `        zone: '${foundationName}'\n` +
                '- name: instana-agent-configuration-pivotal-redis\n  jobs:\n  - name: instana-agent-configuration-pivotal-redis\n' +
                '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                '    - name: redis\n      release: redis-service\n' +
                '- name: instana-agent-configuration-pivotal-rabbitmq\n  jobs:\n  - name: instana-agent-configuration-pivotal-rabbitmq\n' +
                '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                '    - name: rabbitmq-server\n      release: cf-rabbitmq\n' +
                '- name: instana-agent-configuration-pivotal-mysql\n  jobs:\n  - name: instana-agent-configuration-pivotal-mysql-v2\n' +
                '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                '    - name: mysql\n      release: dedicated-mysql\n' +
                '- name: instana-agent-configuration-pxc-mysql\n  jobs:\n  - name: instana-agent-configuration-pxc-mysql\n' +
                '    release: instana-agent\n  include:\n    lifecycle: service\n    jobs:\n' +
                '    - name: pxc-mysql\n      release: pxc\n'
              }
            />
          </Row>
          <HelpBox title="How to set up BOSH runtime configurations">
            <TextWithLink
              text="For more information on how to set up BOSH runtime configurations, refer to the "
              linkText="&quot;Applying the Instana agent runtime configurations&quot; page."
              href="https://docs.instana.io/ecosystem/cloudfoundry/bosh-configuration/#applying-the-instana-agent-runtime-configurations"
            />
          </HelpBox>
          <Spacer />
          <HelpBox title="Supported Stemcells">
            <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial', 'CentOS 7']} />
          </HelpBox>
          <Spacer />
          <HelpBox title="Dynamic agents">
            <TextWithLink
              text="The BOSH release will by default install static agents, but can be configure to install dynamic ones instead. For more information, consult the "
              href="https://docs.instana.io/ecosystem/cloudfoundry/"
              linkText="Instana Cloud Foundry documentation."
            />
          </HelpBox>
        </>
      )}
    />
  );
}

function PcfContent({ agentKey, agentEndpoint }) {
  return (
    <>
      <TextWithLink
        text="Download the &quot;Instana Microservices Application Monitoring&quot; tile from "
        href="https://network.pivotal.io/products/instana-microservices-application-monitoring"
        linkText="Pivotal Network."
      />
      <Spacer />
      <TextWithLink
        text="Upload the &quot;Instana Microservices Application Monitoring&quot; tile to your Ops Manager as described in the"
        href="https://docs.pivotal.io/partners/instana/installing.html"
        linkText="Instana tile documentation on Pivotal Network."
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
          <Script lines={[`443`]} />
        </Col>
        <Col xs={4}>
          <Description lines={['Agent key']} />
          <Script lines={[agentKey]} />
        </Col>
      </GridRow>
      <Spacer />
      <Description
        lines={[
          'Finally, you will need to give your Pivotal Platform foundation a name, for example "prod-eu" or "dev01", via the Agent Zone setting in the Agent Configuration tab.'
        ]}
      />
      <TextWithLink text="Apply the changes introduced by the &quot;Instana Microservices Application Monitoring&quot; tile to all tiles in the Ops Manager. Tiles that are not selected for the &quot;Apply changes&quot; step in Ops Manager will not be visible in Instana." />
      <Spacer />
      <HelpBox title="Supported Ops Manager versions">
        <Listing items={['2.3+']} />
      </HelpBox>
      <Spacer />
      <HelpBox title="Supported Stemcells">
        <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial', 'CentOS 7']} />
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

function WindowsInstallerContent({ agentKey, tenant, tenantUnit }) {
  return (
    <>
      <Description lines={['We make available the latest Windows installer (64Bit) at following address:']} />
      <Script
        lines={[
          `https://instana.io/assets/agent/${tenant}/${tenantUnit}?agentKey=${toURLstring(agentKey)}&type=${toURLstring(
            'exe64'
          )}`
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
        <Description lines={['We recommend to use a JDK from the same vendor as monitored JVMs on the same host.']} />
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
        <Description lines={['We recommend to use a JDK from the same vendor as monitored JVMs on the same host.']} />
      </HelpBox>
    </>
  );
}

function ManualWindowsContent({ butlerDomain, agentKey, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'win64offline', label: 'Windows Zip (64bit, static)' },
    { key: 'win64', label: 'Windows Zip (64bit)' },
    { key: 'win32', label: 'Windows Zip (32bit)' }
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

function getKubernetesYamlConfig(agentKey, agentEndpoint, clusterName, zoneName) {
  return (
    'apiVersion: v1\n' +
    'kind: Namespace\n' +
    'metadata:\n' +
    '  name: instana-agent\n' +
    '---\n' +
    'apiVersion: v1\n' +
    'kind: ServiceAccount\n' +
    'metadata:\n' +
    '  name: instana-agent\n' +
    '  namespace: instana-agent\n' +
    '---\n' +
    'apiVersion: v1\n' +
    'kind: Secret\n' +
    'metadata:\n' +
    '  name: instana-agent-secret\n' +
    '  namespace: instana-agent\n' +
    'type: Opaque\n' +
    'data:\n' +
    `  key: ${btoa(agentKey)}\n` +
    '---\n' +
    'apiVersion: v1\n' +
    'kind: ConfigMap\n' +
    'metadata:\n' +
    '  name: instana-configuration\n' +
    '  namespace: instana-agent\n' +
    'data:\n' +
    '  configuration.yaml: |\n' +
    '\n' +
    '---\n' +
    'apiVersion: apps/v1\n' +
    'kind: DaemonSet\n' +
    'metadata:\n' +
    '  name: instana-agent\n' +
    '  namespace: instana-agent\n' +
    'spec:\n' +
    '  selector:\n' +
    '    matchLabels:\n' +
    '      app: instana-agent\n' +
    '  template:\n' +
    '    metadata:\n' +
    '      labels:\n' +
    '        app: instana-agent\n' +
    '    spec:\n' +
    '      serviceAccountName: instana-agent\n' +
    '      hostIPC: true\n' +
    '      hostNetwork: true\n' +
    '      hostPID: true\n' +
    '      containers:\n' +
    '        - name: instana-agent\n' +
    '          image: instana/agent\n' +
    '          imagePullPolicy: Always\n' +
    '          env:\n' +
    '            - name: INSTANA_AGENT_LEADER_ELECTOR_PORT\n' +
    '              value: "42655"\n' +
    '            - name: INSTANA_KUBERNETES_CLUSTER_NAME\n' +
    `              value: '${clusterName}'\n` +
    '            - name: INSTANA_AGENT_ENDPOINT\n' +
    `              value: ${agentEndpoint}\n` +
    '            - name: INSTANA_AGENT_ENDPOINT_PORT\n' +
    '              value: "443"\n' +
    '            - name: INSTANA_AGENT_KEY\n' +
    '              valueFrom:\n' +
    '                secretKeyRef:\n' +
    '                  name: instana-agent-secret\n' +
    '                  key: key\n' +
    '            - name: INSTANA_ZONE\n' +
    `              value: '${zoneName}'\n` +
    '            - name: JAVA_OPTS\n' +
    '              # Approximately 1/3 of container memory limits to allow for direct-buffer memory usage and JVM overhead\n' +
    '              value: "-Xmx170M -XX:+ExitOnOutOfMemoryError"\n' +
    '            - name: INSTANA_AGENT_POD_NAME\n' +
    '              valueFrom:\n' +
    '                fieldRef:\n' +
    '                  fieldPath: metadata.name\n' +
    '            - name: POD_IP\n' +
    '              valueFrom:\n' +
    '                fieldRef:\n' +
    '                  fieldPath: status.podIP\n' +
    '          securityContext:\n' +
    '            privileged: true\n' +
    '          volumeMounts:\n' +
    '            - name: dev\n' +
    '              mountPath: /dev\n' +
    '            - name: run\n' +
    '              mountPath: /run\n' +
    '            - name: var-run\n' +
    '              mountPath: /var/run\n' +
    '            - name: sys\n' +
    '              mountPath: /sys\n' +
    '            - name: log\n' +
    '              mountPath: /var/log\n' +
    '            - name: var-lib\n' +
    '              mountPath: /var/lib/containers/storage\n' +
    '            - name: machine-id\n' +
    '              mountPath: /etc/machine-id\n' +
    '            - name: configuration\n' +
    '              subPath: configuration.yaml\n' +
    '              mountPath: /root/configuration.yaml\n' +
    '          livenessProbe:\n' +
    '            httpGet: # Agent liveness is published on localhost:42699/status\n' +
    '              path: /status\n' +
    '              port: 42699\n' +
    '            initialDelaySeconds: 75\n' +
    '            periodSeconds: 5\n' +
    '          resources:\n' +
    '            requests:\n' +
    '              memory: "512Mi"\n' +
    '              cpu: "0.5"\n' +
    '            limits:\n' +
    '              memory: "512Mi"\n' +
    '              cpu: "1.5"\n' +
    '          ports:\n' +
    '            - containerPort: 42699\n' +
    '        - name: instana-agent-leader-elector\n' +
    '          image: instana/leader-elector:0.5.4\n' +
    '          env:\n' +
    '            - name: INSTANA_AGENT_POD_NAME\n' +
    '              valueFrom:\n' +
    '                fieldRef:\n' +
    '                  fieldPath: metadata.name\n' +
    '          command:\n' +
    '            - "/app/server"\n' +
    '            - "--election=instana"\n' +
    '            - "--http=localhost:42655"\n' +
    '            - "--id=$(INSTANA_AGENT_POD_NAME)"\n' +
    '          resources:\n' +
    '            requests:\n' +
    '              cpu: "0.1"\n' +
    '              memory: "64Mi"\n' +
    '          livenessProbe:\n' +
    '            httpGet: # Leader elector liveness is tied to Agent, published on localhost:42699/status\n' +
    '              path: /status\n' +
    '              port: 42699\n' +
    '            initialDelaySeconds: 75\n' +
    '            periodSeconds: 5\n' +
    '          ports:\n' +
    '            - containerPort: 42655\n' +
    '      volumes:\n' +
    '        - name: dev\n' +
    '          hostPath:\n' +
    '            path: /dev\n' +
    '        - name: run\n' +
    '          hostPath:\n' +
    '            path: /run\n' +
    '        - name: var-run\n' +
    '          hostPath:\n' +
    '            path: /var/run\n' +
    '        - name: sys\n' +
    '          hostPath:\n' +
    '            path: /sys\n' +
    '        - name: log\n' +
    '          hostPath:\n' +
    '            path: /var/log\n' +
    '        - name: var-lib\n' +
    '          hostPath:\n' +
    '            path: /var/lib/containers/storage\n' +
    '        - name: machine-id\n' +
    '          hostPath:\n' +
    '            path: /etc/machine-id\n' +
    '        - name: configuration\n' +
    '          configMap:\n' +
    '            name: instana-configuration\n' +
    '---\n' +
    'kind: ClusterRole\n' +
    'apiVersion: rbac.authorization.k8s.io/v1\n' +
    'metadata:\n' +
    '  name: instana-agent-role\n' +
    'rules:\n' +
    '- nonResourceURLs:\n' +
    '    - "/version"\n' +
    '    - "/healthz"\n' +
    '  verbs: ["get"]\n' +
    '- apiGroups: ["batch"]\n' +
    '  resources:\n' +
    '    - "jobs"\n' +
    '  verbs: ["get", "list", "watch"]\n' +
    '- apiGroups: ["extensions"]\n' +
    '  resources:\n' +
    '    - "deployments"\n' +
    '    - "replicasets"\n' +
    '    - "ingresses"\n' +
    '  verbs: ["get", "list", "watch"]\n' +
    '- apiGroups: ["apps"]\n' +
    '  resources:\n' +
    '    - "deployments"\n' +
    '    - "replicasets"\n' +
    '  verbs: ["get", "list", "watch"]\n' +
    '- apiGroups: [""]\n' +
    '  resources:\n' +
    '    - "namespaces"\n' +
    '    - "events"\n' +
    '    - "services"\n' +
    '    - "endpoints"\n' +
    '    - "nodes"\n' +
    '    - "pods"\n' +
    '    - "replicationcontrollers"\n' +
    '    - "componentstatuses"\n' +
    '    - "resourcequotas"\n' +
    '  verbs: ["get", "list", "watch"]\n' +
    '- apiGroups: [""]\n' +
    '  resources:\n' +
    '    - "endpoints"\n' +
    '  verbs: ["create", "update", "patch"]\n' +
    '---\n' +
    'kind: ClusterRoleBinding\n' +
    'apiVersion: rbac.authorization.k8s.io/v1\n' +
    'metadata:\n' +
    '  name: instana-agent-role-binding\n' +
    '  namespace: instana-agent\n' +
    'subjects:\n' +
    '- kind: ServiceAccount\n' +
    '  name: instana-agent\n' +
    '  namespace: instana-agent\n' +
    'roleRef:\n' +
    '  kind: ClusterRole\n' +
    '  name: instana-agent-role\n' +
    '  apiGroup: rbac.authorization.k8s.io\n'
  );
}
