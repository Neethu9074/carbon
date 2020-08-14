import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';

// Currently hard-coded: Should be loaded from ui-backend. See:
// com.instana.ui.resource.api.websites.CatalogResource#getWebsiteCatalogTags
// com.instana.ui.resource.api.websites.CatalogResource#getWebsiteTagTree
const tagCatalog = {
  tags: [
    {
      name: 'entity.kubernetes.cluster.label',
      type: 'STRING'
    },
    {
      name: 'entity.kubernetes.namespace',
      type: 'STRING'
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
              type: 'TAG',
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
