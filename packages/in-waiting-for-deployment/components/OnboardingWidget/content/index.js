/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import WindowsInstallerUnattendedContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/WindowsInstallerUnattendedContent';
import K8sGoogleKubernetesEngineContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/K8sGoogleKubernetesEngineContent';
import ElasticComputingWindowsContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ElasticComputingWindowsContent';
import ElasticComputingLinuxContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ElasticComputingLinuxContent';
import GoogleComputeEngineContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/GoogleComputeEngineContent';
import OpenShiftDaemonSetContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/OpenShiftDaemonSetContent';
import OpenShiftOperatorContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/OpenShiftOperatorContent';
import WindowsInstallerContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/WindowsInstallerContent';
import GoogleCloudRunContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/GoogleCloudRunContent';
import IBMServerlessContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/IBMServerlessContent';
import ManualWindowsContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ManualWindowsContent';
import OpenShiftHelmContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/OpenShiftHelmContent';
import ManualIBMApmContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ManualIBMApmContent';
import K8sDaemonSetContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/K8sDaemonSetContent';
import K8sHelmChartContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/K8sHelmChartContent';
import ManualMacOsContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ManualMacOsContent';
import ManualLinuxContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ManualLinuxContent';
import K8sOperatorContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/K8sOperatorContent';
import ManualUnixContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/ManualUnixContent';
import AwsFargateContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/AwsFargateContent';
import AwsSensorContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/AwsSensorContent';
import AwsLambdaContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/AwsLambdaContent';
import CfAndBoshContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/CfAndBoshContent';
import PackagesContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/PackagesContent';
import OneLinerContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/OneLinerContent';
import DockerContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/DockerContent';
import PcfContent from 'in-waiting-for-deployment/components/OnboardingWidget/content/PcfContent';
import { agentInstallViewRestrictedToIBMSaas } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function getEntries({ disableAwsSensorDocumentation }) {
  if (agentInstallViewRestrictedToIBMSaas) {
    return [
      {
        label: t('in-waiting-for-deployment:content.serverless'),
        fullLabel: t('in-waiting-for-deployment:content.serverless'),
        icon: 'lib_actions_force_layout',
        category: t('in-waiting-for-deployment:content.platform'),
        Content: IBMServerlessContent
      },
      {
        label: t('in-waiting-for-deployment:content.kubernetes'),
        icon: 'lib_kubernetes',
        category: t('in-waiting-for-deployment:content.platform'),
        subTechnologies: [
          {
            label: t('in-waiting-for-deployment:content.yaml'),
            keyWords: 'kubernetesdeamonsetk8s',
            Content: K8sDaemonSetContent
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
          }
        ]
      },
      {
        label: t('in-waiting-for-deployment:content.linux'),
        icon: 'lib_linux',
        category: t('in-waiting-for-deployment:content.os'),
        subTechnologies: [
          {
            label: t('in-waiting-for-deployment:content.automaticInstallationOneLiner'),
            keyWords: 'linuxautomaticoneliner',
            Content: props => OneLinerContent({ ...props, azulDisabled: true })
          }
        ]
      }
    ];
  }

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
          Content: AwsFargateContent
        },
        {
          label: t('in-waiting-for-deployment:content.awsLambda'),
          keyWords: 'awslambda',
          Content: AwsLambdaContent
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
    },
    {
      label: t('in-waiting-for-deployment:content.IBM'),
      category: t('in-waiting-for-deployment:content.integrations'),
      keyWords: 'ibmapm',
      icon: 'lib_infra_apmproxy',
      Content: ManualIBMApmContent
    }
  ];
}
