/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import GoogleComputeEngine from 'in-plg/pages/onboarding/AgentList/GoogleCloudPlatform/GoogleComputeEngine';
import LinuxGoogleCloudComputing from 'in-plg/pages/onboarding/AgentList/Linux/LinuxGoogleCloudComputing';
import Windows64BitUnattended from 'in-plg/pages/onboarding/AgentList/Windows/Windows64BitUnattended';
import AzureContainerApps from 'in-plg/pages/onboarding/AgentList/Azure/ContainerApps/ContainerApps';
import LinuxElasticComputing from 'in-plg/pages/onboarding/AgentList/Linux/LinuxElasticComputing';
import GoogleCloudRun from 'in-plg/pages/onboarding/AgentList/GoogleCloudPlatform/GoogleCloudRun';
import KubernetesOperator from 'in-plg/pages/onboarding/AgentList/Kubernetes/KubernetesOperator';
import LinuxAutomaticOTel from 'in-plg/pages/onboarding/AgentList/LinuxOTel/LinuxAutomaticOTel';
import OpenshiftOperator from 'in-plg/pages/onboarding/AgentList/Openshift/OpenshiftOperator';
import AzureAppService from 'in-plg/pages/onboarding/AgentList/Azure/AppService/AppService';
import WindowsZipArchive from 'in-plg/pages/onboarding/AgentList/Windows/WindowsZipArchive';
import WindowsAirgapped from 'in-plg/pages/onboarding/AgentList/Windows/WindowsAirgapped';
import InstanaAwsSensor from 'in-plg/pages/onboarding/AgentList/Aws/InstanaAwsSensor';
import LinuxAutomatic from 'in-plg/pages/onboarding/AgentList/Linux/LinuxAutomatic';
import LinuxAirgapped from 'in-plg/pages/onboarding/AgentList/Linux/LinuxAirgapped';
import AwsFargate from 'in-plg/pages/onboarding/AgentList/Aws/Fargate/AwsFargate';
import Windows64Bit from 'in-plg/pages/onboarding/AgentList/Windows/Windows64Bit';
import LinuxPackages from 'in-plg/pages/onboarding/AgentList/Linux/LinuxPackages';
import MacOsAirgapped from 'in-plg/pages/onboarding/AgentList/Mac/MacOsAirgapped';
import Kubernetes from 'in-plg/pages/onboarding/AgentList/Kubernetes/Kubernetes';
import UnixAirgapped from 'in-plg/pages/onboarding/AgentList/Unix/UnixAirgapped';
import AwsEc2Windows from 'in-plg/pages/onboarding/AgentList/Aws/AwsEc2Windows';
import LinuxArchive from 'in-plg/pages/onboarding/AgentList/Linux/LinuxArchive';
import VmwareTanzu from 'in-plg/pages/onboarding/AgentList/Vmware/VmwareTanzu';
import AwsLambda from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/AwsLambda';
import ZOSAutomatic from 'in-plg/pages/onboarding/AgentList/ZOS/ZOSAutomatic';
import Openshift from 'in-plg/pages/onboarding/AgentList/Openshift/Openshift';
import WindowsEC2 from 'in-plg/pages/onboarding/AgentList/Windows/WindowsEC2';
import IBMiArchive from 'in-plg/pages/onboarding/AgentList/IBMi/IBMiArchive';
import AwsEc2Linux from 'in-plg/pages/onboarding/AgentList/Aws/AwsEc2Linux';
import CfAndBosh from 'in-plg/pages/onboarding/AgentList/Bosh/CfAndBosh';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
import Docker from 'in-plg/pages/onboarding/AgentList/Docker/Docker';
import MacOs from 'in-plg/pages/onboarding/AgentList/Mac/MacOs';
import Unix from 'in-plg/pages/onboarding/AgentList/Unix/Unix';
import { t } from 'in-i18n';

enum datasource {
  OTel_collector = 'otelcollector',
  instana_agent = 'instanaagent'
}

export function getEntriesForFreeTrial() {
  return [
    {
      id: 'k8_helm',
      title: 'Kubernetes - Helm Chart',
      pageName: 'Kubernetes > Helm Chart', // tracking data
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.helmChart'),
        keyWords: 'kuberneteshelmchartk8s',
        Content: Kubernetes
      }
    },
    {
      id: 'k8_operator',
      title: 'Kubernetes - Operator',
      pageName: 'Kubernetes > Operator', // tracking data
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.operator'),
        keyWords: 'kubernetesoperatork8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'k8_deamon',
      title: 'Kubernetes - Yaml',
      pageName: 'Kubernetes > Yaml', // tracking data
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.yaml'),
        keyWords: 'kubernetesdeamonsetk8s',
        Content: Kubernetes
      }
    },
    {
      id: 'k8_aks',
      title: 'Kubernetes - Azure Kubernetes Service (AKS)',
      pageName: 'Kubernetes > Azure Kubernetes Service (AKS)', // tracking data
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
        keyWords: 'azurekubernetesserviceaksk8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'k8_eks',
      title: 'Amazon Web Services - Elastic Kubernetes Service (EKS)',
      pageName: 'Kubernetes > Elastic Kubernetes Service (EKS)', // tracking data
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.awsElasticKubernetesServiceEks'),
        keyWords: 'awselastickubernetesserviceeksk8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'openshift_operator',
      title: 'Openshift - Operator',
      pageName: 'Openshift > Operator', // tracking data
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.operator'),
        keyWords: 'openshiftoperatork8s',
        Content: OpenshiftOperator
      }
    },
    {
      id: 'openshift_helm',
      title: 'Openshift - Helm Chart',
      pageName: 'Openshift > Helm Chart', // tracking data
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.helmChart'),
        keyWords: 'openshifthelmchartk8s',
        Content: Openshift
      }
    },
    {
      id: 'openshift_k8_daemon',
      title: 'Openshift - YAML',
      pageName: 'Openshift > YAML', // tracking data
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.yaml'),
        keyWords: 'openshiftdaemonsetk8s',
        Content: Openshift
      }
    },
    {
      id: 'docker',
      title: 'Docker',
      pageName: 'Docker', // tracking data
      label: t('in-waiting-for-deployment:content.docker'),
      icon: 'lib_container_docker',
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'dockercontainer',
      Content: Docker
    },
    {
      id: 'linux_auto',
      label: t('in-waiting-for-deployment:content.linux'),
      title: 'Linux - Automatic Installation (One-liner)',
      pageName: 'Linux > Automatic Installation (One-liner)', // tracking data
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
        keyWords: 'linuxautomaticoneliner',
        Content: LinuxAutomatic
      }
    },
    {
      id: 'zos',
      label: t('in-plg:agentDetails.zos.zos'),
      title: 'z/OS - Automatic Installation (One-liner)',
      pageName: 'z/OS > Automatic Installation (One-liner)', // tracking data
      icon: 'lib_infra_host_zos',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
        keyWords: 'zosautomaticoneliner',
        Content: ZOSAutomatic
      }
    },
    {
      id: 'linux_deb_rpm',
      title: 'Linux - Packages(DEB, RPM)',
      pageName: 'Linux > Packages(DEB, RPM)', // tracking data
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.packagesDebRpm'),
        keyWords: 'linuxpackagesdebrpm',
        Content: LinuxPackages
      }
    },
    {
      id: 'linux_archive_tar',
      title: 'Linux - Archive (tar.gz)',
      pageName: 'Linux > Archive (tar.gz)', // tracking data
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.archiveTarGz'),
        keyWords: 'linuxmanualtarball',
        Content: LinuxArchive
      }
    },
    {
      id: 'ibmi_archive_tar',
      title: 'IBM i - Archive (tar.gz)',
      pageName: 'IBMi > Archive (tar.gz)', // tracking data
      label: t('in-plg:agentDetails.ibmi.ibmi'),
      icon: 'lib_infra_ibmIOs',
      category: t('in-plg:agentDetails.ibmi.os'),
      subTechnology: {
        label: t('in-plg:agentDetails.ibmi.archiveTarGz'),
        keyWords: 'ibmimanualtarball',
        Content: IBMiArchive
      }
    },
    {
      id: 'linux_ec2',
      title: 'Linux - AWS Elastic Computing (EC2)',
      pageName: 'Linux > AWS Elastic Computing (EC2)', // tracking data
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.awsElasticComputingEc2'),
        keyWords: 'linuxawselasticcomputingec2',
        Content: LinuxElasticComputing
      }
    },
    {
      id: 'linux_gce',
      title: 'Linux - Google Computer Engine (GCE)',
      pageName: 'Linux > Google Computer Engine (GCE)', // tracking data
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.googleComputeEngineGce'),
        keyWords: 'linuxgooglecomputeenginegce',
        Content: LinuxGoogleCloudComputing
      }
    },
    {
      id: 'unix',
      title: 'Unix',
      pageName: 'Unix', // tracking data
      label: t('in-waiting-for-deployment:content.unix'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'unixtarball',
      icon: 'lib_unix',
      Content: Unix
    },
    {
      id: 'aws_sensor',
      title: 'Amazon Web Services - Instana AWS Sensor',
      pageName: 'Amazon Web Services > Instana AWS Sensor', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.instanaAwsSensor'),
        keyWords: 'aws',
        Content: InstanaAwsSensor
      }
    },
    {
      id: 'aws_ec2_linux',
      title: 'Amazon Web Services - Elastic Computing (EC2) - Linux',
      pageName: 'Amazon Web Services > Elastic Computing (EC2) - Linux', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticComputingEc2Linux'),
        keyWords: 'elasticcomputeec2linux',
        Content: AwsEc2Linux
      }
    },
    {
      id: 'aws_ec2_windows',
      title: 'Amazon Web Services - Elastic Computing (EC2) - Windows 64 bit',
      pageName: 'Amazon Web Services > Elastic Computing (EC2) - Windows 64 bit', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
        keyWords: 'elasticcomputeec2windows',
        Content: AwsEc2Windows
      }
    },
    {
      id: 'aws_eks',
      title: 'Amazon Web Services - Elastic Container Service for Kubernetes (EKS)',
      pageName: 'Amazon Web Services > Elastic Container Service for Kubernetes (EKS)', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticContainerServiceForKubernetesEks'),
        keyWords: 'elasticcontainerkubernetesk8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'aws_fargate',
      title: 'Amazon Web Services - AWS Fargate',
      pageName: 'Amazon Web Services > AWS Fargate', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.awsFargate'),
        keyWords: 'awsfargate',
        Content: AwsFargate
      }
    },
    {
      id: 'aws_lambda',
      title: 'Amazon Web Services - AWS Lambda',
      pageName: 'Amazon Web Services > AWS Lambda', // tracking data
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.awsLambda'),
        keyWords: 'awslambda',
        Content: AwsLambda
      }
    },
    {
      id: 'azure_aks',
      title: 'Microsoft Azure - Azure Kubernetes Service (AKS)',
      pageName: 'Microsoft Azure > Azure Kubernetes Service (AKS)', // tracking data
      label: t('in-waiting-for-deployment:content.azure'),
      icon: 'lib_azure',
      fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
        keyWords: 'azurekubernetesk8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'azure_aca',
      title: 'Microsoft Azure - Azure Container Apps',
      pageName: 'Microsoft Azure > Azure Container Apps', // tracking data
      label: t('in-waiting-for-deployment:content.azure'),
      icon: 'lib_azure',
      fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureContainerApps'),
        keyWords: 'azurecontainerapps',
        Content: AzureContainerApps
      }
    },
    {
      id: 'azure_app_service',
      title: 'Microsoft Azure - Azure App Service',
      pageName: 'Microsoft Azure > Azure App Service', // tracking data
      label: t('in-waiting-for-deployment:content.azure'),
      icon: 'lib_azure',
      fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureAppService'),
        keyWords: 'azureappservice',
        Content: AzureAppService
      }
    },
    {
      id: 'gcp_gce',
      title: 'Google CLoud Platform - Google Cloud Engine (GCE) - Linux',
      pageName: 'Google CLoud Platform > Google Cloud Engine (GCE) - Linux', // tracking data
      label: t('in-waiting-for-deployment:content.googleCloud'),
      icon: 'google_cloud_icon',
      fullLabel: t('in-waiting-for-deployment:content.googleCloudPlatform'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.googleComputeEngineGceLinux'),
        keyWords: 'googlecloudplatformcomputeenginelinuxgce',
        Content: GoogleComputeEngine
      }
    },
    {
      id: 'gcp_gcr',
      title: 'Google CLoud Platform - Google Cloud Run',
      pageName: 'Google CLoud Platform > Google Cloud Run', // tracking data
      label: t('in-waiting-for-deployment:content.googleCloud'),
      icon: 'google_cloud_icon',
      fullLabel: t('in-waiting-for-deployment:content.googleCloudPlatform'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.googleCloudRun'),
        keyWords: 'googlecloudrun',
        Content: GoogleCloudRun
      }
    },
    {
      id: 'cf_bosh',
      title: 'Cloud Foundry and other BOSH based deployments',
      pageName: 'Cloud Foundry and other BOSH based deployments', // tracking data
      label: t('in-waiting-for-deployment:content.cloudFoundryAndBosh'),
      fullLabel: t('in-waiting-for-deployment:content.cloudFoundryAndOtherBoshBasedDeployments'),
      icon: 'cloud_foundry_icon',
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'cloudfoundryboshcf',
      Content: CfAndBosh
    },
    {
      id: 'vmware_tanzu',
      title: 'VMware Tanzu',
      pageName: 'VMware Tanzu', // tracking data
      label: t('in-waiting-for-deployment:content.vMwareTanzu'),
      icon: 'lib_vmware_tanzu',
      fullLabel: t('in-waiting-for-deployment:content.vMwareTanzuFormerlyKnownAsPivotalCloudFoundry'),
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'vmwaretanzupivotalpcf',
      Content: VmwareTanzu
    },
    {
      id: 'macos_universal',
      title: 'macOs',
      pageName: 'macOs', // tracking data
      label: t('in-waiting-for-deployment:content.macOs'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'macosx',
      icon: 'lib_apple',
      subTechnology: {
        label: t('in-waiting-for-deployment:content.macOs64BitUniversal'),
        keyWords: 'macos64bituniversal',
        Content: MacOs
      }
    },
    {
      id: 'windows_64_bit',
      title: 'Windows - Windows Installer 64Bit',
      pageName: 'Windows > Windows Installer 64Bit', // tracking data
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.windowsInstaller64Bit'),
        keyWords: 'windowsexe',
        Content: Windows64Bit
      }
    },
    {
      id: 'windows_64_bit_unattended',
      title: 'Windows - Windows Installer 64Bit (Unattended)',
      pageName: 'Windows > Windows Installer 64Bit (Unattended)', // tracking data
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.windowsInstaller64BitUnattended'),
        keyWords: 'windowsexe',
        Content: Windows64BitUnattended
      }
    },
    {
      id: 'windows_zip',
      title: 'Windows - Zip Archives',
      pageName: 'Windows > Zip Archives', // tracking data
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.zipArchives'),
        keyWords: 'windowszip',
        Content: WindowsZipArchive
      }
    },
    {
      id: 'windows_ec2_64',
      title: 'Windows - Elastic Computing (EC2) - Windows 64 bit',
      pageName: 'Windows > Elastic Computing (EC2) - Windows 64 bit', // tracking data
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
        keyWords: 'elasticcomputeec2windows',
        Content: WindowsEC2
      }
    },
    {
      id: 'windows_airgapped',
      title: 'Windows - Air-gapped (Installer, Archive - 32bit, 64bit)',
      pageName: 'Windows > Air-gapped (Installer, Archive - 32bit, 64bit)', // tracking data
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.windowsAirgapped'),
        keyWords: 'windowsairgapped',
        Content: WindowsAirgapped
      }
    },
    {
      id: 'linux_airgapped',
      title: 'Linux - Air-gapped (Archive, DEB, RPM)',
      pageName: 'Linux > Air-gapped (Archive, DEB, RPM)', // tracking data
      label: t('in-waiting-for-deployment:content.linux'),
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.linuxAirgapped'),
        keyWords: 'linuxairgapped',
        Content: LinuxAirgapped
      }
    },
    {
      id: 'unix_airgapped',
      title: 'Unix - Air-gapped (Archive)',
      pageName: 'Unix > Air-gapped (Archive)', // tracking data
      label: t('in-waiting-for-deployment:content.unix'),
      icon: 'lib_unix',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.unixAirgapped'),
        keyWords: 'unixairgapped',
        Content: UnixAirgapped
      }
    },
    {
      id: 'macos_airgapped',
      title: 'macOs - Air-gapped (Archive)',
      pageName: 'macOs > Air-gapped (Archive)', // tracking data
      label: t('in-waiting-for-deployment:content.macOs'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'macosxairgapped',
      icon: 'lib_apple',
      subTechnology: {
        label: t('in-waiting-for-deployment:content.macAirgapped'),
        keyWords: 'macosxairgapped',
        Content: MacOsAirgapped
      }
    }
  ];
}

export interface FreeTrialEntry {
  accordionTitle: string;
  accordionDesciption: string;
  data: ContentProps[];
}

export type FreeTrialEntries = {
  [key in datasource]: FreeTrialEntry;
};

export function getEntriesForFreeTrialV2() {
  let freeTrialEntries: FreeTrialEntries = {
    [datasource.OTel_collector]: {
      accordionTitle: t('in-plg:agentDetails.common.openTelemetryCollectors'),
      accordionDesciption: t('in-plg:agentDetails.common.openTelemetryCollectorsDesciption'),
      data: [
        {
          id: 'linux_auto_otel',
          title: 'Linux - Automatic Installation (One-liner)',
          pageName: 'Linux > One-liner otel', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
            keyWords: 'linuxautomaticoneliner',
            Content: LinuxAutomaticOTel
          }
        }
      ]
    },
    [datasource.instana_agent]: {
      accordionTitle: t('in-plg:agentDetails.common.instanaAgents'),
      accordionDesciption: t('in-plg:agentDetails.common.instanaAgentsDesciption'),
      data: [
        {
          id: 'k8_helm',
          title: 'Kubernetes - Helm Chart',
          pageName: 'Kubernetes > Helm Chart', // tracking data
          label: t('in-waiting-for-deployment:content.kubernetes'),
          icon: 'lib_kubernetes',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.helmChart'),
            keyWords: 'kuberneteshelmchartk8s',
            Content: Kubernetes
          }
        },
        {
          id: 'k8_operator',
          title: 'Kubernetes - Operator',
          pageName: 'Kubernetes > Operator', // tracking data
          label: t('in-waiting-for-deployment:content.kubernetes'),
          icon: 'lib_kubernetes',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.operator'),
            keyWords: 'kubernetesoperatork8s',
            Content: KubernetesOperator
          }
        },
        {
          id: 'k8_deamon',
          title: 'Kubernetes - Yaml',
          pageName: 'Kubernetes > Yaml', // tracking data
          label: t('in-waiting-for-deployment:content.kubernetes'),
          icon: 'lib_kubernetes',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.yaml'),
            keyWords: 'kubernetesdeamonsetk8s',
            Content: Kubernetes
          }
        },
        {
          id: 'k8_aks',
          title: 'Kubernetes - Azure Kubernetes Service (AKS)',
          pageName: 'Kubernetes > Azure Kubernetes Service (AKS)', // tracking data
          label: t('in-waiting-for-deployment:content.kubernetes'),
          icon: 'lib_kubernetes',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
            keyWords: 'azurekubernetesserviceaksk8s',
            Content: KubernetesOperator
          }
        },
        {
          id: 'k8_eks',
          title: 'Amazon Web Services - Elastic Kubernetes Service (EKS)',
          pageName: 'Kubernetes > Elastic Kubernetes Service (EKS)', // tracking data
          label: t('in-waiting-for-deployment:content.kubernetes'),
          icon: 'lib_kubernetes',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.awsElasticKubernetesServiceEks'),
            keyWords: 'awselastickubernetesserviceeksk8s',
            Content: KubernetesOperator
          }
        },
        {
          id: 'openshift_operator',
          title: 'Openshift - Operator',
          pageName: 'Openshift > Operator', // tracking data
          label: t('in-waiting-for-deployment:content.openShift'),
          icon: 'lib_openshift',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.operator'),
            keyWords: 'openshiftoperatork8s',
            Content: OpenshiftOperator
          }
        },
        {
          id: 'openshift_helm',
          title: 'Openshift - Helm Chart',
          pageName: 'Openshift > Helm Chart', // tracking data
          label: t('in-waiting-for-deployment:content.openShift'),
          icon: 'lib_openshift',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.helmChart'),
            keyWords: 'openshifthelmchartk8s',
            Content: Openshift
          }
        },
        {
          id: 'openshift_k8_daemon',
          title: 'Openshift - YAML',
          pageName: 'Openshift > YAML', // tracking data
          label: t('in-waiting-for-deployment:content.openShift'),
          icon: 'lib_openshift',
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.yaml'),
            keyWords: 'openshiftdaemonsetk8s',
            Content: Openshift
          }
        },
        {
          id: 'docker',
          title: 'Docker',
          pageName: 'Docker', // tracking data
          label: t('in-waiting-for-deployment:content.docker'),
          icon: 'lib_container_docker',
          category: t('in-waiting-for-deployment:content.platform'),
          keyWords: 'dockercontainer',
          Content: Docker
        },
        {
          id: 'linux_auto',
          label: t('in-waiting-for-deployment:content.linux'),
          title: 'Linux - Automatic Installation (One-liner)',
          pageName: 'Linux > Automatic Installation (One-liner)', // tracking data
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
            keyWords: 'linuxautomaticoneliner',
            Content: LinuxAutomatic
          }
        },
        {
          id: 'zos',
          label: t('in-plg:agentDetails.zos.zos'),
          title: 'z/OS - Automatic Installation (One-liner)',
          pageName: 'z/OS > Automatic Installation (One-liner)', // tracking data
          icon: 'lib_infra_host_zos',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
            keyWords: 'zosautomaticoneliner',
            Content: ZOSAutomatic
          }
        },
        {
          id: 'linux_deb_rpm',
          title: 'Linux - Packages(DEB, RPM)',
          pageName: 'Linux > Packages(DEB, RPM)', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.packagesDebRpm'),
            keyWords: 'linuxpackagesdebrpm',
            Content: LinuxPackages
          }
        },
        {
          id: 'linux_archive_tar',
          title: 'Linux - Archive (tar.gz)',
          pageName: 'Linux > Archive (tar.gz)', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.archiveTarGz'),
            keyWords: 'linuxmanualtarball',
            Content: LinuxArchive
          }
        },
        {
          id: 'ibmi_archive_tar',
          title: 'IBM i - Archive (tar.gz)',
          pageName: 'IBMi > Archive (tar.gz)', // tracking data
          label: t('in-plg:agentDetails.ibmi.ibmi'),
          icon: 'lib_infra_ibmIOs',
          category: t('in-plg:agentDetails.ibmi.os'),
          subTechnology: {
            label: t('in-plg:agentDetails.ibmi.archiveTarGz'),
            keyWords: 'ibmimanualtarball',
            Content: IBMiArchive
          }
        },
        {
          id: 'linux_ec2',
          title: 'Linux - AWS Elastic Computing (EC2)',
          pageName: 'Linux > AWS Elastic Computing (EC2)', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.awsElasticComputingEc2'),
            keyWords: 'linuxawselasticcomputingec2',
            Content: LinuxElasticComputing
          }
        },
        {
          id: 'linux_gce',
          title: 'Linux - Google Computer Engine (GCE)',
          pageName: 'Linux > Google Computer Engine (GCE)', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.googleComputeEngineGce'),
            keyWords: 'linuxgooglecomputeenginegce',
            Content: LinuxGoogleCloudComputing
          }
        },
        {
          id: 'unix',
          title: 'Unix',
          pageName: 'Unix', // tracking data
          label: t('in-waiting-for-deployment:content.unix'),
          category: t('in-waiting-for-deployment:content.os'),
          keyWords: 'unixtarball',
          icon: 'lib_unix',
          Content: Unix
        },
        {
          id: 'aws_sensor',
          title: 'Amazon Web Services - Instana AWS Sensor',
          pageName: 'Amazon Web Services > Instana AWS Sensor', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.instanaAwsSensor'),
            keyWords: 'aws',
            Content: InstanaAwsSensor
          }
        },
        {
          id: 'aws_ec2_linux',
          title: 'Amazon Web Services - Elastic Computing (EC2) - Linux',
          pageName: 'Amazon Web Services > Elastic Computing (EC2) - Linux', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.elasticComputingEc2Linux'),
            keyWords: 'elasticcomputeec2linux',
            Content: AwsEc2Linux
          }
        },
        {
          id: 'aws_ec2_windows',
          title: 'Amazon Web Services - Elastic Computing (EC2) - Windows 64 bit',
          pageName: 'Amazon Web Services > Elastic Computing (EC2) - Windows 64 bit', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
            keyWords: 'elasticcomputeec2windows',
            Content: AwsEc2Windows
          }
        },
        {
          id: 'aws_eks',
          title: 'Amazon Web Services - Elastic Container Service for Kubernetes (EKS)',
          pageName: 'Amazon Web Services > Elastic Container Service for Kubernetes (EKS)', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.elasticContainerServiceForKubernetesEks'),
            keyWords: 'elasticcontainerkubernetesk8s',
            Content: KubernetesOperator
          }
        },
        {
          id: 'aws_fargate',
          title: 'Amazon Web Services - AWS Fargate',
          pageName: 'Amazon Web Services > AWS Fargate', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.awsFargate'),
            keyWords: 'awsfargate',
            Content: AwsFargate
          }
        },
        {
          id: 'aws_lambda',
          title: 'Amazon Web Services - AWS Lambda',
          pageName: 'Amazon Web Services > AWS Lambda', // tracking data
          label: t('in-waiting-for-deployment:content.aws'),
          icon: 'aws_icon',
          fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.awsLambda'),
            keyWords: 'awslambda',
            Content: AwsLambda
          }
        },
        {
          id: 'azure_aks',
          title: 'Microsoft Azure - Azure Kubernetes Service (AKS)',
          pageName: 'Microsoft Azure > Azure Kubernetes Service (AKS)', // tracking data
          label: t('in-waiting-for-deployment:content.azure'),
          icon: 'lib_azure',
          fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
            keyWords: 'azurekubernetesk8s',
            Content: KubernetesOperator
          }
        },
        {
          id: 'azure_aca',
          title: 'Microsoft Azure - Azure Container Apps',
          pageName: 'Microsoft Azure > Azure Container Apps', // tracking data
          label: t('in-waiting-for-deployment:content.azure'),
          icon: 'lib_azure',
          fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.azureContainerApps'),
            keyWords: 'azurecontainerapps',
            Content: AzureContainerApps
          }
        },
        {
          id: 'azure_app_service',
          title: 'Microsoft Azure - Azure App Service',
          pageName: 'Microsoft Azure > Azure App Service', // tracking data
          label: t('in-waiting-for-deployment:content.azure'),
          icon: 'lib_azure',
          fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.azureAppService'),
            keyWords: 'azureappservice',
            Content: AzureAppService
          }
        },
        {
          id: 'gcp_gce',
          title: 'Google CLoud Platform - Google Cloud Engine (GCE) - Linux',
          pageName: 'Google CLoud Platform > Google Cloud Engine (GCE) - Linux', // tracking data
          label: t('in-waiting-for-deployment:content.googleCloud'),
          icon: 'google_cloud_icon',
          fullLabel: t('in-waiting-for-deployment:content.googleCloudPlatform'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.googleComputeEngineGceLinux'),
            keyWords: 'googlecloudplatformcomputeenginelinuxgce',
            Content: GoogleComputeEngine
          }
        },
        {
          id: 'gcp_gcr',
          title: 'Google CLoud Platform - Google Cloud Run',
          pageName: 'Google CLoud Platform > Google Cloud Run', // tracking data
          label: t('in-waiting-for-deployment:content.googleCloud'),
          icon: 'google_cloud_icon',
          fullLabel: t('in-waiting-for-deployment:content.googleCloudPlatform'),
          category: t('in-waiting-for-deployment:content.platform'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.googleCloudRun'),
            keyWords: 'googlecloudrun',
            Content: GoogleCloudRun
          }
        },
        {
          id: 'cf_bosh',
          title: 'Cloud Foundry and other BOSH based deployments',
          pageName: 'Cloud Foundry and other BOSH based deployments', // tracking data
          label: t('in-waiting-for-deployment:content.cloudFoundryAndBosh'),
          fullLabel: t('in-waiting-for-deployment:content.cloudFoundryAndOtherBoshBasedDeployments'),
          icon: 'cloud_foundry_icon',
          category: t('in-waiting-for-deployment:content.platform'),
          keyWords: 'cloudfoundryboshcf',
          Content: CfAndBosh
        },
        {
          id: 'vmware_tanzu',
          title: 'VMware Tanzu',
          pageName: 'VMware Tanzu', // tracking data
          label: t('in-waiting-for-deployment:content.vMwareTanzu'),
          icon: 'lib_vmware_tanzu',
          fullLabel: t('in-waiting-for-deployment:content.vMwareTanzuFormerlyKnownAsPivotalCloudFoundry'),
          category: t('in-waiting-for-deployment:content.platform'),
          keyWords: 'vmwaretanzupivotalpcf',
          Content: VmwareTanzu
        },
        {
          id: 'macos_universal',
          title: 'macOs',
          pageName: 'macOs', // tracking data
          label: t('in-waiting-for-deployment:content.macOs'),
          category: t('in-waiting-for-deployment:content.os'),
          keyWords: 'macosx',
          icon: 'lib_apple',
          subTechnology: {
            label: t('in-waiting-for-deployment:content.macOs64BitUniversal'),
            keyWords: 'macos64bituniversal',
            Content: MacOs
          }
        },
        {
          id: 'windows_64_bit',
          title: 'Windows - Windows Installer 64Bit',
          pageName: 'Windows > Windows Installer 64Bit', // tracking data
          label: t('in-waiting-for-deployment:content.windows'),
          icon: 'lib_windows',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.windowsInstaller64Bit'),
            keyWords: 'windowsexe',
            Content: Windows64Bit
          }
        },
        {
          id: 'windows_64_bit_unattended',
          title: 'Windows - Windows Installer 64Bit (Unattended)',
          pageName: 'Windows > Windows Installer 64Bit (Unattended)', // tracking data
          label: t('in-waiting-for-deployment:content.windows'),
          icon: 'lib_windows',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.windowsInstaller64BitUnattended'),
            keyWords: 'windowsexe',
            Content: Windows64BitUnattended
          }
        },
        {
          id: 'windows_zip',
          title: 'Windows - Zip Archives',
          pageName: 'Windows > Zip Archives', // tracking data
          label: t('in-waiting-for-deployment:content.windows'),
          icon: 'lib_windows',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.zipArchives'),
            keyWords: 'windowszip',
            Content: WindowsZipArchive
          }
        },
        {
          id: 'windows_ec2_64',
          title: 'Windows - Elastic Computing (EC2) - Windows 64 bit',
          pageName: 'Windows > Elastic Computing (EC2) - Windows 64 bit', // tracking data
          label: t('in-waiting-for-deployment:content.windows'),
          icon: 'lib_windows',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
            keyWords: 'elasticcomputeec2windows',
            Content: WindowsEC2
          }
        },
        {
          id: 'windows_airgapped',
          title: 'Windows - Air-gapped (Installer, Archive - 32bit, 64bit)',
          pageName: 'Windows > Air-gapped (Installer, Archive - 32bit, 64bit)', // tracking data
          label: t('in-waiting-for-deployment:content.windows'),
          icon: 'lib_windows',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.windowsAirgapped'),
            keyWords: 'windowsairgapped',
            Content: WindowsAirgapped
          }
        },
        {
          id: 'linux_airgapped',
          title: 'Linux - Air-gapped (Archive, DEB, RPM)',
          pageName: 'Linux > Air-gapped (Archive, DEB, RPM)', // tracking data
          label: t('in-waiting-for-deployment:content.linux'),
          icon: 'lib_linux',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.linuxAirgapped'),
            keyWords: 'linuxairgapped',
            Content: LinuxAirgapped
          }
        },
        {
          id: 'unix_airgapped',
          title: 'Unix - Air-gapped (Archive)',
          pageName: 'Unix > Air-gapped (Archive)', // tracking data
          label: t('in-waiting-for-deployment:content.unix'),
          icon: 'lib_unix',
          category: t('in-waiting-for-deployment:content.os'),
          subTechnology: {
            label: t('in-waiting-for-deployment:content.unixAirgapped'),
            keyWords: 'unixairgapped',
            Content: UnixAirgapped
          }
        },
        {
          id: 'macos_airgapped',
          title: 'macOs - Air-gapped (Archive)',
          pageName: 'macOs > Air-gapped (Archive)', // tracking data
          label: t('in-waiting-for-deployment:content.macOs'),
          category: t('in-waiting-for-deployment:content.os'),
          keyWords: 'macosxairgapped',
          icon: 'lib_apple',
          subTechnology: {
            label: t('in-waiting-for-deployment:content.macAirgapped'),
            keyWords: 'macosxairgapped',
            Content: MacOsAirgapped
          }
        }
      ]
    }
  };
  return freeTrialEntries;
}
