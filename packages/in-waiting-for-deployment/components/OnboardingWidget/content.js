import React, { useState } from 'react';

import {
  Bash,
  Description,
  DropDown,
  DownloadButton,
  CheckBox,
  SmallSpacer,
  LargeSpacer,
  HelpBox,
  Listing,
  TextWithLink,
  Row,
  Script,
  YAML,
  JSON
} from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-new-components/layout/Grid';

export default [
  {
    label: 'AWS',
    fullLabel: 'Amazon Web Services',
    subTechnologies: [
      {
        label: 'Instana AWS Sensor',
        Content: AwsSensorContent
      },
      {
        label: 'Elastic Cloud (EC2)',
        Content: EC2Content
      },
      {
        label: 'Elastic Container Service for Kubernetes (EKS)',
        Content: K8sDaemonSetContent
      }
    ]
  },
  {
    label: 'Azure',
    fullLabel: 'Microsoft Azure',
    subTechnologies: [
      {
        label: 'Azure Kubernetes Service (AKS)',
        Content: K8sDaemonSetContent
      }
    ]
  },
  {
    label: 'Google Cloud',
    fullLabel: 'Google Cloud Platform',
    subTechnologies: [
      {
        label: 'Google Kubernetes Engine (GKE)',
        Content: K8sGoogleKubernetesEngineContent
      }
    ]
  },
  {
    label: 'Docker',
    icon: 'lib_container_docker',
    Content: DockerContent
  },
  {
    label: 'Kubernetes (all flavours)',
    icon: 'lib_kubernetes',
    subTechnologies: [
      {
        label: 'Helm chart',
        Content: K8sHelmChartContent
      },
      {
        label: 'Daemon set',
        Content: K8sDaemonSetContent
      },
      {
        label: 'Azure Kubernetes Service (AKS)',
        Content: K8sDaemonSetContent
      },
      {
        label: 'AWS Elastic Container Service for Kubernetes (EKS)',
        Content: K8sDaemonSetContent
      },
      {
        label: 'Google Kubernetes Engine (GKE)',
        Content: K8sGoogleKubernetesEngineContent
      }
    ]
  },
  {
    label: 'Pivotal Platform (formerly PCF)',
    fullLabel: 'Pivotal Platform (formerly known as Pivotal Cloud Foundry)',
    Content: PcfContent
  },
  {
    label: 'Cloud Foundry and BOSH',
    fullLabel: 'Cloud Foundry and other BOSH-based deployments',
    icon: 'lib_cloudfoundry',
    Content: CfAndBoshContent
  },
  {
    label: 'Linux',
    Content: OneLinerContent
  },
  {
    label: 'Linux Packages (DEB, RPM)',
    Content: PackagesContent
  },
  {
    label: 'Windows Installer',
    Content: WindowsInstallerContent
  },
  {
    label: 'Static tarballs (all OSes and architectures)',
    Content: ManualContent
  }
];

function DockerContent({ agentKey, region }) {
  return (
    <>
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
          `--env="INSTANA_AGENT_KEY=${agentKey}" \\`,
          `--env="INSTANA_AGENT_ENDPOINT=saas-${region}.instana.io" \\`,
          '--env="INSTANA_AGENT_ENDPOINT_PORT=443" \\',
          'instana/agent'
        ]}
      />
    </>
  );
}
function AwsSensorContent({ agentKey, region }) {
  return (
    <>
      <HelpBox title="The Instana AWS agent is a must-have for AWS setups!">
        <TextWithLink
          text="The Instana AWS Agent monitors lots of different AWS technologies in one single package. For the full listy, refer to the "
          linkText="supported AWS Services list."
          href="https://docs.instana.io/ecosystem/aws/#aws-services"
        />
      </HelpBox>
      <LargeSpacer />
      <Description
        lines={[
          'Use the following as "User Data" when spinning up a dedicated EC2 Virtual Machine. We advise to run the Instana AWS sensor on an "Current Generation General Purpose" machine running Linux. The m4.large instances, for example, are perfectly suited to the task.'
        ]}
      />
      <Bash
        lines={[
          'curl -o setup_agent.sh https://setup.instana.io/agent',
          'chmod 700 ./setup_agent.sh',
          `sudo ./setup_agent.sh -a ${agentKey} -m aws -t dynamic -l ${region} -s`
        ]}
      />
      <LargeSpacer />
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
      <LargeSpacer />
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
      <LargeSpacer />
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

function EC2Content({ agentKey, regionShort }) {
  const jvmModeOptions = [
    { key: 'dynamic', label: 'Dynamic agent with Zulu JVM' },
    { key: 'static', label: 'Static agent with Zulu JVM' }
  ];
  const [jvmMode, setMode] = useState(jvmModeOptions[0].key);
  const [isService, setIsService] = useState(false);

  return (
    <>
      <Row>
        <DropDown value={jvmMode} options={jvmModeOptions} onChange={setMode} />
        <CheckBox
          label="Install and start as service (only supported for systemd-based systems)"
          checked={isService}
          setChecked={setIsService}
        />
      </Row>
      <SmallSpacer />
      <Bash
        lines={[
          'curl -o setup_agent.sh https://setup.instana.io/agent',
          'chmod 700 ./setup_agent.sh',
          `sudo ./setup_agent.sh -a ${agentKey} -t ${jvmMode} -l ${regionShort} -y ${isService ? '-s' : ''}`
        ]}
      />
      <LargeSpacer />
      <HelpBox>
        <TextWithLink
          text={
            'Use the script below as "User Data" when spinning up a new EC2 Virtual Machine. For more information on how to use the script above with User Data in AWS EC2, refer to the '
          }
          linkText="&quot;Running Commands on Your Linux Instance at Launch&quot; page."
          href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
        />
      </HelpBox>
      <SmallSpacer />
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

function OneLinerContent({ agentKey, regionShort }) {
  const jvmModeOptions = ['Dynamic agent with Zulu JVM', 'Static agent with Zulu JVM'];
  const [jvmMode, setMode] = useState(jvmModeOptions[0]);

  const installModeOptions = ['Interactive installation', 'Silent installation'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const [isService, setIsService] = useState(false);

  return (
    <>
      <DropDown value={jvmMode} options={jvmModeOptions} onChange={setMode} />
      <DropDown value={installMode} options={installModeOptions} onChange={setInstallMode} />
      <SmallSpacer />
      <CheckBox
        label="Install and start as service (only supported for systemd-based systems)"
        checked={isService}
        setChecked={setIsService}
      />
      <SmallSpacer />
      <Bash
        lines={[
          `curl -o setup_agent.sh https://setup.instana.io/agent && chmod 700 ./setup_agent.sh && sudo ./setup_agent.sh -a ${agentKey} -t ${
            jvmMode === jvmModeOptions[0] ? 'dynamic' : 'static'
          } -l ${regionShort} ${installMode === installModeOptions[0] ? '' : '-y'} ${isService ? '-s' : ''}`
        ]}
      />
      <LargeSpacer />
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
        <SmallSpacer />
        <TextWithLink
          text="Packages are also available from our download site:"
          href="https://packages.instana.io/agent/download"
        />
      </HelpBox>
    </>
  );
}

function K8sGoogleKubernetesEngineContent({ agentKey, region }) {
  return (
    <>
      <TextWithLink
        text="Installing the Instana agent on Google Kubernetes Engine is straightforward. Look for "
        href="https://console.cloud.google.com/marketplace/details/instana-public/instana?q=instana"
        linkText="Instana on the Google Cloud Marketplace."
      />
      <LargeSpacer />
      <Description
        lines={[
          'Click on "Configure" and select the Organization or Project containing the Kubernetes Cluster you want to deploy Instana to. The following configurations have to be applied during the "Configure" step in the Google Cloud Platform console.'
        ]}
      />
      <LargeSpacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Instana Service Endpoint']} />
          <Script lines={[`saas-${region}.instana.io`]} />
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
      <LargeSpacer />
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

function K8sHelmChartContent({ agentKey, region }) {
  return (
    <>
      <Description lines={['Helm Chart']} />
      <Bash
        lines={[
          'helm install --name instana-agent --namespace instana-agent \\',
          `--set agent.key=${agentKey} \\`,
          `--set agent.endpointHost=saas-${region}.instana.io \\`,
          '--set agent.endpointPort=443 \\',
          '--set zone.name=K8s-cluster \\',
          'stable/instana-agent'
        ]}
      />
      <LargeSpacer />
      <HelpBox>
        <TextWithLink
          text="For more information visit the"
          href="https://docs.instana.io/quick_start/agent_setup/container/kubernetes/"
          linkText="Instana Kubernetes documentation."
        />
      </HelpBox>
    </>
  );
}

function K8sDaemonSetContent({ agentKey, region }) {
  return (
    <>
      <YAML title="Daemonset.yaml" content={getKubernetesYamlConfig(agentKey, region)} />
      <LargeSpacer />
      <HelpBox>
        <TextWithLink
          text="For more information visit the"
          href="https://docs.instana.io/quick_start/agent_setup/container/kubernetes/"
          linkText="Instana Kubernetes documentation."
        />
      </HelpBox>
    </>
  );
}

function CfAndBoshContent({ agentKey, region }) {
  return (
    <>
      <Description lines={['Apply the following as BOSH runtime configuration to your BOSH director']} />
      <YAML
        content={
          `releases:\n- name: instana-agent\n  version: TBD\n\naddons:\n` +
          '- name: instana-agent\n  jobs:\n  - name: instana-agent\n' +
          `    release: instana-agent\n  properties:\n    instana:\n      agent:\n` +
          `        mode: APM\n        key: ${agentKey}\n        endpoint: saas-${region}.instana.io\n` +
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
      <SmallSpacer />
      <HelpBox title="Supported Stemcells">
        <Listing items={['Ubuntu Trusty', 'Ubuntu Xenial', 'CentOS 7']} />
      </HelpBox>
      <LargeSpacer />
      <HelpBox title="Dynamic agents">
        <TextWithLink
          text="The BOSH release will by default install static agents, but can be configure to install dynamic ones instead. For more information, consult the "
          href="https://docs.instana.io/ecosystem/cloudfoundry/bosh-configuration.md"
          linkText="Instana Cloud Foundry documentation."
        />
      </HelpBox>
    </>
  );
}

function PcfContent({ agentKey, region }) {
  return (
    <>
      <TextWithLink
        text="Download the &quot;Instana Microservices Application Monitoring&quot; tile from "
        href="https://network.pivotal.io/products/instana-microservices-application-monitoring"
        linkText="Pivotal Network."
      />
      <LargeSpacer />
      <TextWithLink
        text="Upload the &quot;Instana Microservices Application Monitoring&quot; tile to your Ops Manager as described in the"
        href="https://docs.pivotal.io/partners/instana/installing.html"
        linkText="Instana tile documentation on Pivotal Network."
      />
      <SmallSpacer />
      <Description
        lines={[
          'The following configurations have to be applied to the "Backend configuration" tab of the "Instana Microservices Application Monitoring" tile in Ops Manager.'
        ]}
      />
      <LargeSpacer />
      <GridRow>
        <Col xs={4}>
          <Description lines={['Endpoint host']} />
          <Script lines={[`saas-${region}.instana.io`]} />
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
      <LargeSpacer />
      <Description
        lines={[
          'Finally, you will need to give your Pivotal Platform foundation a name, for example "prod-eu" or "dev01", via the Agent Zone setting in the Agent Configuration tab.'
        ]}
      />
      <TextWithLink text="Apply the changes introduced by the &quot;Instana Microservices Application Monitoring&quot; tile to all tiles in the Ops Manager. Tiles that are not selected for the &quot;Apply changes&quot; step in Ops Manager will not be visible in Instana." />
      <LargeSpacer />
      <HelpBox title="Supported Ops Manager versions">
        <Listing items={['2.3+']} />
      </HelpBox>
      <LargeSpacer />
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

function WindowsInstallerContent({ agentKey, region, tenant, tenantUnit }) {
  return (
    <>
      <Description lines={['We make available the latest Windows installer (64Bit) at following address']} />
      <Script
        lines={[
          `https://www.instana.io/assets/agent/${tenant}/${tenantUnit}?region=${decodeURIComponent(
            region
          )}&agentKey=${decodeURIComponent(agentKey)}&type=${decodeURIComponent('exe64')}`
        ]}
      />
    </>
  );
}

function ManualContent({ agentKey, region, tenant, tenantUnit }) {
  const agentOptions = [
    { key: 'linux64', label: 'Linux (64Bit)' },
    { key: 'linux32', label: 'Linux (32Bit)' },
    { key: 'linuxarm64', label: 'Linux (64Bit - ARM)' },
    { key: 'linuxarm32', label: 'Linux (32Bit - ARM)' },
    { key: 'linuxppc64', label: 'Linux (64Bit - PowerPC)' },
    { key: 'linuxppc32', label: 'Linux (32Bit - PowerPC)' },
    { key: 'linuxs390x', label: 'Linux (s390x)' },
    { key: 'win64offline', label: 'Windows Zip (64bit, static)' },
    { key: 'win64', label: 'Windows Zip (64bit)' },
    { key: 'win32', label: 'Windows Zip (32bit)' },
    { key: 'mac', label: 'Mac OS (64bit - Intel)' },
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
        <DownloadButton
          href={`https://www.instana.io/assets/agent/${tenant}/${tenantUnit}?region=${decodeURIComponent(
            region
          )}&agentKey=${decodeURIComponent(agentKey)}&type=${decodeURIComponent(option)}`}
        />
      </Row>
      <SmallSpacer />
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
        <SmallSpacer />
        <Description lines={['We recommend to use a JDK from the same vendor as monitored JVMs on the same host.']} />
      </HelpBox>
    </>
  );
}

function getKubernetesYamlConfig(agentKey, region) {
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
    'apiVersion: extensions/v1beta1\n' +
    'kind: DaemonSet\n' +
    'metadata:\n' +
    '  name: instana-agent\n' +
    '  namespace: instana-agent\n' +
    'spec:\n' +
    '  template:\n' +
    '    metadata:\n' +
    '      labels:\n' +
    '        app: instana-agent\n' +
    '    spec:\n' +
    '      serviceAccount: instana-agent\n' +
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
    '            - name: INSTANA_ZONE\n' +
    '              value: k8s-cluster-name\n' +
    '            - name: INSTANA_AGENT_ENDPOINT\n' +
    `              value: saas-${region}.instana.io\n` +
    '            - name: INSTANA_AGENT_ENDPOINT_PORT\n' +
    '              value: "443"\n' +
    '            - name: INSTANA_AGENT_KEY\n' +
    '              valueFrom:\n' +
    '                secretKeyRef:\n' +
    '                  name: instana-agent-secret\n' +
    '                  key: key\n' +
    '            - name: JAVA_OPTS\n' +
    '              # Approximately 1/3 of container memory limits to allow for direct-buffer memory usage and JVM overhead\n' +
    '              value: "-Xmx170M -XX:+ExitOnOutOfMemoryError"\n' +
    '            - name: INSTANA_AGENT_POD_NAME\n' +
    '              valueFrom:\n' +
    '                fieldRef:\n' +
    '                  fieldPath: metadata.name\n' +
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
