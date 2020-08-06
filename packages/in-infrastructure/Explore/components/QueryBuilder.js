import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';

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
    },
    {
      name: 'entity.selfType',
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
      label: 'Instana',
      children: [
        {
          type: 'LEVEL',
          label: 'Internal',
          children: [
            {
              type: 'TAG',
              label: 'Type',
              icon: 'lib_kubernetes_label',
              description: 'Exact type of entity',
              tagName: 'entity.selfType'
            }
          ]
        }
      ]
    }
  ]
};

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  // see dedicated TagCatalog story for more information about the
  // TagCatalog structure.
  getTagCatalog: successObservableFactory(tagCatalog),

  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
