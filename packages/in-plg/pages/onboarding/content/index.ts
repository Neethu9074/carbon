/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import GoogleComputeEngine from 'in-plg/pages/onboarding/AgentList/GoogleCloudPlatform/GoogleComputeEngine';
import LinuxGoogleCloudComputing from 'in-plg/pages/onboarding/AgentList/Linux/LinuxGoogleCloudComputing';
import Windows64BitUnattended from 'in-plg/pages/onboarding/AgentList/Windows/Windows64BitUnattended';
import LinuxElasticComputing from 'in-plg/pages/onboarding/AgentList/Linux/LinuxElasticComputing';
import GoogleCloudRun from 'in-plg/pages/onboarding/AgentList/GoogleCloudPlatform/GoogleCloudRun';
import KubernetesOperator from 'in-plg/pages/onboarding/AgentList/Kubernetes/KubernetesOperator';
import OpenshiftOperator from 'in-plg/pages/onboarding/AgentList/Openshift/OpenshiftOperator';
import WindowsZipArchive from 'in-plg/pages/onboarding/AgentList/Windows/WindowsZipArchive';
import InstanaAwsSensor from 'in-plg/pages/onboarding/AgentList/Aws/InstanaAwsSensor';
import LinuxAutomatic from 'in-plg/pages/onboarding/AgentList/Linux/LinuxAutomatic';
import AwsFargate from 'in-plg/pages/onboarding/AgentList/Aws/Fargate/AwsFargate';
import Windows64Bit from 'in-plg/pages/onboarding/AgentList/Windows/Windows64Bit';
import LinuxPackages from 'in-plg/pages/onboarding/AgentList/Linux/LinuxPackages';
import Kubernetes from 'in-plg/pages/onboarding/AgentList/Kubernetes/Kubernetes';
import AwsEc2Windows from 'in-plg/pages/onboarding/AgentList/Aws/AwsEc2Windows';
import LinuxArchive from 'in-plg/pages/onboarding/AgentList/Linux/LinuxArchive';
import VmwareTanzu from 'in-plg/pages/onboarding/AgentList/Vmware/VmwareTanzu';
import Openshift from 'in-plg/pages/onboarding/AgentList/Openshift/Openshift';
import WindowsEC2 from 'in-plg/pages/onboarding/AgentList/Windows/WindowsEC2';
import AwsEc2Linux from 'in-plg/pages/onboarding/AgentList/Aws/AwsEc2Linux';
import CfAndBosh from 'in-plg/pages/onboarding/AgentList/Bosh/CfAndBosh';
import Docker from 'in-plg/pages/onboarding/AgentList/Docker/Docker';
import AwsEks from 'in-plg/pages/onboarding/AgentList/Aws/AwsEks';
import Azure from 'in-plg/pages/onboarding/AgentList/Azure/Azure';
import MacOs from 'in-plg/pages/onboarding/AgentList/Mac/MacOs';
import Unix from 'in-plg/pages/onboarding/AgentList/Unix/Unix';
import { t } from 'in-i18n';
import AwsLambda from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/AwsLambda';

export function getEntriesForFreeTrial() {
  return [
    {
      id: 'aws_sensor',
      title: 'Amazon Web Services - Instana AWS Sensor',
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
      label: t('in-waiting-for-deployment:content.aws'),
      icon: 'aws_icon',
      fullLabel: t('in-waiting-for-deployment:content.amazonWebServices'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticContainerServiceForKubernetesEks'),
        keyWords: 'elasticcontainerkubernetesk8s',
        Content: AwsEks
      }
    },
    {
      id: 'aws_fargate',
      title: 'Amazon Web Services - AWS Fargate',
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
      label: t('in-waiting-for-deployment:content.azure'),
      icon: 'lib_azure',
      iconColor: '#3178CD',
      fullLabel: t('in-waiting-for-deployment:content.microsoftAzure'),
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
        keyWords: 'azurekubernetesk8s',
        Content: Azure
      }
    },
    {
      id: 'gcp_gce',
      title: 'Google CLoud Platform - Google Cloud Engine (GCE) - Linux',
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
      id: 'docker',
      title: 'Docker',
      label: t('in-waiting-for-deployment:content.docker'),
      icon: 'lib_container_docker',
      iconColor: '#2D6DD0',
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'dockercontainer',
      Content: Docker
    },
    {
      id: 'k8_operator',
      title: 'Kubernetes - Operator',
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      iconColor: '#3F6EDE',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.operator'),
        keyWords: 'kubernetesoperatork8s',
        Content: KubernetesOperator
      }
    },
    {
      id: 'k8_helm',
      title: 'Kubernetes - Helm Chart',
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      iconColor: '#3F6EDE',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.helmChart'),
        keyWords: 'kuberneteshelmchartk8s',
        Content: Kubernetes
      }
    },
    {
      id: 'k8_deamon',
      title: 'Kubernetes - Yaml',
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      iconColor: '#3F6EDE',
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
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      iconColor: '#3F6EDE',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.azureKubernetesServiceAks'),
        keyWords: 'azurekubernetesserviceaksk8s',
        Content: Kubernetes
      }
    },
    {
      id: 'k8_eks',
      title: 'Kubernetes - AWS Elastic Kubernetes Service (EKS)',
      label: t('in-waiting-for-deployment:content.kubernetes'),
      icon: 'lib_kubernetes',
      iconColor: '#3F6EDE',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.awsElasticKubernetesServiceEks'),
        keyWords: 'awselastickubernetesserviceeksk8s',
        Content: Kubernetes
      }
    },
    {
      id: 'openshift_operator',
      title: 'Openshift - Operator',
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      iconColor: '#DA2430',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.operator'),
        keyWords: 'kubernetesoperatork8s',
        Content: OpenshiftOperator
      }
    },
    {
      id: 'openshift_helm',
      title: 'Openshift - Helm Chart',
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      iconColor: '#DA2430',
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
      label: t('in-waiting-for-deployment:content.openShift'),
      icon: 'lib_openshift',
      iconColor: '#DA2430',
      category: t('in-waiting-for-deployment:content.platform'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.yaml'),
        keyWords: 'kubernetesdeamonsetk8s',
        Content: Openshift
      }
    },
    {
      id: 'cf_bosh',
      title: 'Cloud Foundry and other BOSH based deployments',
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
      label: t('in-waiting-for-deployment:content.vMwareTanzu'),
      icon: 'lib_vmware_tanzu',
      fullLabel: t('in-waiting-for-deployment:content.vMwareTanzuFormerlyKnownAsPivotalCloudFoundry'),
      category: t('in-waiting-for-deployment:content.platform'),
      keyWords: 'vmwaretanzupivotalpcf',
      Content: VmwareTanzu
    },
    {
      id: 'linux_auto',
      label: t('in-waiting-for-deployment:content.linux'),
      title: 'Linux - Automatic Installation (One-liner)',
      icon: 'lib_linux',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
        keyWords: 'linuxautomaticoneliner',
        Content: LinuxAutomatic
      }
    },
    {
      id: 'linux_deb_rpm',
      title: 'Linux - Packages(DEB, RPM)',
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
      id: 'linux_ec2',
      title: 'Linux - AWS Elastic Computing (EC2)',
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
      id: 'macos_universal',
      title: 'macOs',
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
      id: 'unix',
      title: 'Unix',
      label: t('in-waiting-for-deployment:content.unix'),
      category: t('in-waiting-for-deployment:content.os'),
      keyWords: 'unixtarball',
      icon: 'lib_unix',
      Content: Unix
    },
    {
      id: 'windows_64_bit',
      title: 'Windows - Windows Installer 64Bit',
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
      label: t('in-waiting-for-deployment:content.windows'),
      icon: 'lib_windows',
      category: t('in-waiting-for-deployment:content.os'),
      subTechnology: {
        label: t('in-waiting-for-deployment:content.elasticComputingEc2Windows64Bit'),
        keyWords: 'elasticcomputeec2windows',
        Content: WindowsEC2
      }
    }
  ];
}
