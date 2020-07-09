export default {
  tags: [],

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
              icon: 'lib_views_tag',
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
              icon: 'lib_views_tag',
              description: 'String - Service´s name',
              tagName: 'service.name'
            }
          ]
        }
      ]
    }
  ]
};
