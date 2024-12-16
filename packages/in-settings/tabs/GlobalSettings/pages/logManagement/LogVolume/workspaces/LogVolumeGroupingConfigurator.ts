/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';

//@ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';

// needs to be changed to get data from backend later, after GA
export const groupTags = {
  tagTree: [
    {
      type: 'TAG',
      label: 'Zone',
      tagName: 'zone',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: false
    },
    {
      type: 'TAG',
      label: 'Host name',
      icon: 'lib_help_error_info_outline',
      tagName: 'host_name',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: false
    },
    {
      type: 'TAG',
      label: 'Kubernetes namespace name',
      icon: 'lib_application_service',
      tagName: 'kubernetes_namespace_name',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: false
    },

    {
      type: 'TAG',
      label: 'Kubernetes cluster name',
      tagName: 'kubernetes_cluster_name',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: false
    },
    {
      type: 'TAG',
      label: 'Kubernetes daemonset name',
      tagName: 'kubernetes_daemonset_name',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: false
    },
    {
      type: 'TAG',
      label: 'Kubernetes deployment Name',
      icon: 'lib_kubernetes_cluster',
      tagName: 'kubernetes_deployment_name',
      isGroupingTag: true,
      isSuggestionsTag: true,
      isInfraTag: true
    }
  ],
  tags: [
    {
      name: 'zone',
      label: 'Zone',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    },
    {
      name: 'host_name',
      label: 'Host name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    },
    {
      name: 'kubernetes_namespace_name',
      label: 'Kubernetes namespace name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    },
    {
      name: 'kubernetes_cluster_name',
      label: 'Kubernetes cluster name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    },
    {
      name: 'kubernetes_daemonset_name',
      label: 'Kubernetes daemonset name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    },
    {
      name: 'kubernetes_deployment_name',
      label: 'Kubernetes deployment Name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    }
  ]
};

const logVolumeTagCatalog = just({ data: groupTags });

const { GroupingConfigurator, isGroupingConfigurationValid: isGroupingConfigurationValidInternal } =
  createGroupingConfigurator({
    getTagCatalog: () => logVolumeTagCatalog,
    getSuggestions: () => {}
  });

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
