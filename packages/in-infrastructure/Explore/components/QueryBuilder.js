import { successObservableFactory } from 'in-services/util/result';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

// Currently hard-coded: Should be loaded from ui-backend. See:
// com.instana.ui.resource.api.websites.CatalogResource#getWebsiteCatalogTags
// com.instana.ui.resource.api.websites.CatalogResource#getWebsiteTagTree
const tagCatalog = {
  tags: [
    {
      name: 'kubernetes.cluster.label',
      type: 'KEY_VALUE_PAIRS'
    },
    {
      name: 'kubernetes.cluster.name',
      type: 'STRING'
    },
    {
      name: 'kubernetes.namespace.label',
      type: 'KEY_VALUE_PAIRS'
    },
    {
      name: 'kubernetes.namespace.name',
      type: 'STRING',
      canApplyToSource: true,
      canApplyToDestination: true
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
    }
  ]
};

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  // see dedicated TagCatalog story for more information about the
  // TagCatalog structure.
  getTagCatalog: successObservableFactory(tagCatalog)
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
