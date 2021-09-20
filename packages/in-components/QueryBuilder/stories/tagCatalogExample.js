/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default {
  tags: [
    {
      name: 'kubernetes.label',
      type: 'STRING'
    },
    {
      name: 'kubernetes.cluster.label',
      type: 'STRING'
    },
    {
      name: 'kubernetes.cluster.name',
      type: 'STRING'
    },
    {
      name: 'kubernetes.namespace.label',
      type: 'STRING'
    },
    {
      name: 'kubernetes.namespace.name',
      type: 'STRING'
    },
    {
      name: 'application.name',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'service.name',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'endpoint.name',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'call.latency',
      type: 'NUMBER',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'trace.latency',
      type: 'NUMBER',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'call.erroneous',
      type: 'BOOLEAN',
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'call.http.header',
      type: 'KEY_VALUE_PAIR',
      canApplyToSource: true,
      canApplyToDestination: true
    }
  ],

  tagTree: [
    {
      type: 'TAG',
      label: 'Label',
      icon: 'lib_kubernetes_label',
      description: 'Root level tag',
      tagName: 'kubernetes.label'
    },
    {
      type: 'LEVEL',
      label: 'Kubernetes',
      children: [
        {
          type: 'TAG',
          label: 'Label',
          icon: 'lib_kubernetes_label',
          description: 'Key/Value - Defined in Kubernetes (matches Cluster/POD… labels)',
          tagName: 'kubernetes.label'
        },
        {
          type: 'LEVEL',
          label: 'Cluster',
          icon: 'plugin:kubernetesCluster',
          children: [
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_kubernetes_label',
              description: 'Key/Value - Defined in Kubernetes',
              tagName: 'kubernetes.cluster.label'
            },
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Cluster´s name',
              tagName: 'kubernetes.cluster.name'
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
              label: 'Label',
              icon: 'lib_kubernetes_label',
              description: 'Key/Value - Defined in Kubernetes',
              tagName: 'kubernetes.namespace.label'
            },
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Namespace´s name',
              tagName: 'kubernetes.namespace.name'
            }
          ]
        }
      ]
    },
    {
      type: 'LEVEL',
      label: 'Application',
      children: [
        {
          type: 'LEVEL',
          label: 'Application Perspective',
          icon: 'lib_application',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              description: 'String - Application´s name',
              tagName: 'application.name'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Service',
          icon: 'lib_application_service',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_application_service',
              description: 'String - Service´s name',
              tagName: 'service.name'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Endpoint',
          icon: 'lib_application_endpoint',
          children: [
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_application_endpoint',
              description: 'String - Endpoint name',
              tagName: 'endpoint.name'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Calls',
          children: [
            {
              type: 'TAG',
              label: 'Latency',
              description: 'Call latency',
              tagName: 'call.latency'
            },
            {
              type: 'TAG',
              label: 'Erroneous',
              description: 'Whether or not the call was successful',
              tagName: 'call.erroneous'
            },
            {
              type: 'TAG',
              label: 'HTTP Headers',
              description: 'HTTP headers in HTTP request',
              tagName: 'call.http.header'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Trace',
          children: [
            {
              type: 'TAG',
              label: 'Latency',
              description: 'Trace latency',
              tagName: 'trace.latency'
            }
          ]
        }
      ]
    }
  ]
};
