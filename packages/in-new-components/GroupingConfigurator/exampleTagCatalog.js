/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      label: 'Kubernetes',
      children: [
        {
          type: 'LEVEL',
          label: 'Cluster',
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'KEY_VALUE_PAIR',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Cluster´s label',
              tagName: 'entity.kubernetes.cluster.label'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Namespace',
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Namespace Name',
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
          label: 'Internal',
          children: [
            {
              type: 'TAG',
              label: 'Type',
              icon: 'lib_views_tag',
              description: 'Type of entity',
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_views_tag',
              description: 'Label of entity',
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
          label: 'Kubernetes',
          children: [
            {
              type: 'LEVEL',
              label: 'Cluster',
              icon: 'lib_kubernetes_cluster',
              children: [
                {
                  type: 'KEY_VALUE_PAIR',
                  label: 'Name',
                  icon: 'lib_kubernetes_label',
                  description: 'String - Cluster´s label',
                  tagName: 'entity.kubernetes.cluster.label'
                }
              ]
            },
            {
              type: 'LEVEL',
              label: 'Namespace',
              icon: 'lib_kubernetes_namespace',
              children: [
                {
                  type: 'TAG',
                  label: 'Name',
                  icon: 'lib_kubernetes_label',
                  description: 'String - Namespace Name',
                  tagName: 'entity.kubernetes.namespace'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Cluster',
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'KEY_VALUE_PAIR',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Cluster´s label',
              tagName: 'entity.kubernetes.cluster.label'
            }
          ]
        },
        {
          type: 'KEY_VALUE_PAIR',
          label: 'Name',
          icon: 'lib_kubernetes_label',
          description: 'String - Cluster´s label',
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
          label: 'Kubernetes',
          children: [
            {
              type: 'LEVEL',
              label: 'Cluster',
              icon: 'lib_kubernetes_cluster',
              children: [
                {
                  type: 'KEY_VALUE_PAIR',
                  label: 'Name',
                  icon: 'lib_kubernetes_label',
                  description: 'String - Cluster´s label',
                  tagName: 'entity.kubernetes.cluster.label'
                }
              ]
            },
            {
              type: 'LEVEL',
              label: 'Namespace',
              icon: 'lib_kubernetes_namespace',
              children: [
                {
                  type: 'TAG',
                  label: 'Name',
                  icon: 'lib_kubernetes_label',
                  description: 'String - Namespace Name',
                  tagName: 'entity.kubernetes.namespace'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Namespace',
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Namespace Name',
              tagName: 'entity.kubernetes.namespace'
            }
          ]
        },
        {
          type: 'TAG',
          label: 'Name',
          icon: 'lib_kubernetes_label',
          description: 'String - Namespace Name',
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
              label: 'Internal',
              children: [
                {
                  type: 'TAG',
                  label: 'Type',
                  icon: 'lib_views_tag',
                  description: 'Type of entity',
                  tagName: 'entity.selfType'
                },
                {
                  type: 'TAG',
                  label: 'Label',
                  icon: 'lib_views_tag',
                  description: 'Label of entity',
                  tagName: 'entity.label'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Internal',
          children: [
            {
              type: 'TAG',
              label: 'Type',
              icon: 'lib_views_tag',
              description: 'Type of entity',
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_views_tag',
              description: 'Label of entity',
              tagName: 'entity.label'
            }
          ]
        },
        {
          type: 'TAG',
          label: 'Type',
          icon: 'lib_views_tag',
          description: 'Type of entity',
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
              label: 'Internal',
              children: [
                {
                  type: 'TAG',
                  label: 'Type',
                  icon: 'lib_views_tag',
                  description: 'Type of entity',
                  tagName: 'entity.selfType'
                },
                {
                  type: 'TAG',
                  label: 'Label',
                  icon: 'lib_views_tag',
                  description: 'Label of entity',
                  tagName: 'entity.label'
                }
              ]
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Internal',
          children: [
            {
              type: 'TAG',
              label: 'Type',
              icon: 'lib_views_tag',
              description: 'Type of entity',
              tagName: 'entity.selfType'
            },
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_views_tag',
              description: 'Label of entity',
              tagName: 'entity.label'
            }
          ]
        },
        {
          type: 'TAG',
          label: 'Label',
          icon: 'lib_views_tag',
          description: 'Label of entity',
          tagName: 'entity.label'
        }
      ]
    }
  },
  allTagNames: ['entity.kubernetes.cluster.label', 'entity.kubernetes.namespace', 'entity.selfType', 'entity.label']
};
