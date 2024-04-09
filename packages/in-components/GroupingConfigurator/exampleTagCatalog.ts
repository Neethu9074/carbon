/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export default {
  tags: [
    {
      name: 'entity.kubernetes.cluster.label',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'entity.kubernetes.namespace',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'entity.selfType',
      type: 'STRING'
    },
    {
      name: 'entity.label',
      type: 'STRING'
    }
  ],
  tagTree: [
    {
      type: 'LEVEL',
      label: t('in-components:groupingConfigurator.exampleTagCatalogLabelKubernetes'),
      children: [
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelCluster'),
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'KEY_VALUE_PAIR',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
              icon: 'lib_kubernetes_label',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringClustersLabel'),
              tagName: 'entity.kubernetes.cluster.label'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelNamespace'),
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
              icon: 'lib_kubernetes_label',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringNamespaceName'),
              tagName: 'entity.kubernetes.namespace'
            }
          ]
        }
      ]
    },
    {
      type: 'LEVEL',
      label: 'Instana',
      children: [
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelInternal'),
          children: [
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
              tagName: 'entity.label'
            }
          ]
        }
      ]
    }
  ],
  tagsByName: {
    'entity.kubernetes.cluster.label': {
      name: 'entity.kubernetes.cluster.label',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true,
      path: [
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelKubernetes'),
          children: [
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelCluster'),
              icon: 'lib_kubernetes_cluster',
              children: [
                {
                  type: 'KEY_VALUE_PAIR',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
                  icon: 'lib_kubernetes_label',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringClustersLabel'),
                  tagName: 'entity.kubernetes.cluster.label'
                }
              ]
            },
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelNamespace'),
              icon: 'lib_kubernetes_namespace',
              children: [
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
                  icon: 'lib_kubernetes_label',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringNamespaceName'),
                  tagName: 'entity.kubernetes.namespace'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelCluster'),
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'KEY_VALUE_PAIR',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
              icon: 'lib_kubernetes_label',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringClustersLabel'),
              tagName: 'entity.kubernetes.cluster.label'
            }
          ]
        },
        {
          type: 'KEY_VALUE_PAIR',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
          icon: 'lib_kubernetes_label',
          description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringClustersLabel'),
          tagName: 'entity.kubernetes.cluster.label'
        }
      ]
    },
    'entity.kubernetes.namespace': {
      name: 'entity.kubernetes.namespace',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true,
      path: [
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelKubernetes'),
          children: [
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelCluster'),
              icon: 'lib_kubernetes_cluster',
              children: [
                {
                  type: 'KEY_VALUE_PAIR',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
                  icon: 'lib_kubernetes_label',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringClustersLabel'),
                  tagName: 'entity.kubernetes.cluster.label'
                }
              ]
            },
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelNamespace'),
              icon: 'lib_kubernetes_namespace',
              children: [
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
                  icon: 'lib_kubernetes_label',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringNamespaceName'),
                  tagName: 'entity.kubernetes.namespace'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelNamespace'),
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
              icon: 'lib_kubernetes_label',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringNamespaceName'),
              tagName: 'entity.kubernetes.namespace'
            }
          ]
        },
        {
          type: 'TAG',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelName'),
          icon: 'lib_kubernetes_label',
          description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionStringNamespaceName'),
          tagName: 'entity.kubernetes.namespace'
        }
      ]
    },
    'entity.selfType': {
      name: 'entity.selfType',
      type: 'STRING',
      path: [
        {
          type: 'LEVEL',
          label: 'Instana',
          children: [
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelInternal'),
              children: [
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
                  icon: 'lib_views_tag',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
                  tagName: 'entity.selfType'
                },
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
                  icon: 'lib_views_tag',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
                  tagName: 'entity.label'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelInternal'),
          children: [
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
              tagName: 'entity.label'
            }
          ]
        },
        {
          type: 'TAG',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
          icon: 'lib_views_tag',
          description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
          tagName: 'entity.selfType'
        }
      ]
    },
    'entity.label': {
      name: 'entity.label',
      type: 'STRING',
      path: [
        {
          type: 'LEVEL',
          label: 'Instana',
          children: [
            {
              type: 'LEVEL',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelInternal'),
              children: [
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
                  icon: 'lib_views_tag',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
                  tagName: 'entity.selfType'
                },
                {
                  type: 'TAG',
                  label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
                  icon: 'lib_views_tag',
                  description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
                  tagName: 'entity.label'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelInternal'),
          children: [
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelType'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionTypeOfEntity'),
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
              icon: 'lib_views_tag',
              description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
              tagName: 'entity.label'
            }
          ]
        },
        {
          type: 'TAG',
          label: t('in-components:groupingConfigurator.exampleTagCatalogLabelLabel'),
          icon: 'lib_views_tag',
          description: t('in-components:groupingConfigurator.exampleTagCatalogDescriptionLabelOfEntity'),
          tagName: 'entity.label'
        }
      ]
    }
  },
  allTagNames: ['entity.kubernetes.cluster.label', 'entity.kubernetes.namespace', 'entity.selfType', 'entity.label']
};
