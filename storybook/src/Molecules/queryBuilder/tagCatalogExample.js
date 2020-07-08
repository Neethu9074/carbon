export default {
  tags: [],

  tagTreeNodes: [
    {
      type: 'GROUP',
      label: 'Kubernetes',
      children: [
        {
          type: 'SUB_LEVEL',
          label: 'Cluster',
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_kubernetes_label',
              description: 'Key/Value - Defined in Kubernetes',
              tag: 'kubernetes.cluster.label'
            },
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Cluster´s name',
              tag: 'kubernetes.cluster.name'
            }
          ]
        },
        {
          type: 'SUB_LEVEL',
          label: 'Namespace',
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_kubernetes_label',
              description: 'Key/Value - Defined in Kubernetes',
              tag: 'kubernetes.namespace.label'
            },
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Namespace´s name',
              tag: 'kubernetes.namespace.name'
            }
          ]
        }
      ]
    },
    {
      type: 'GROUP',
      label: 'Application',
      children: [
        {
          type: 'SUB_LEVEL',
          label: 'Application Perspective',
          icon: 'lib_application',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_views_tag',
              description: 'String - Application´s name',
              tag: 'application.name'
            }
          ]
        },
        {
          type: 'SUB_LEVEL',
          label: 'Service',
          icon: 'lib_application_service',
          children: [
            {
              type: 'TAG',
              label: 'Label',
              icon: 'lib_views_tag',
              description: 'String - Service´s name',
              tag: 'service.name'
            }
          ]
        }
      ]
    }
  ]
};
