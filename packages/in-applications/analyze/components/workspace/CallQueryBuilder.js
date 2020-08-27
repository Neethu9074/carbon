import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';

const tagCatalog = {
  tags: [
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
      name: 'call.type',
      type: 'STRING'
    }
  ],

  tagTree: [
    {
      type: 'LEVEL',
      label: 'Application',
      children: [
        {
          type: 'LEVEL',
          label: 'Endpoint',
          icon: 'lib_kubernetes_cluster',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Cluster´s label',
              tagName: 'endpoint.name'
            }
          ]
        },
        {
          type: 'LEVEL',
          label: 'Service',
          icon: 'lib_kubernetes_namespace',
          children: [
            {
              type: 'TAG',
              label: 'Name',
              icon: 'lib_kubernetes_label',
              description: 'String - Namespace Name',
              tagName: 'service.name'
            }
          ]
        }
      ]
    },
    {
      type: 'LEVEL',
      label: 'Call',
      children: [
        {
          type: 'LEVEL',
          label: 'Call',
          children: [
            {
              type: 'TAG',
              label: 'Type',
              icon: 'lib_views_tag',
              description: 'Type of entity',
              tagName: 'call.type'
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

export const isCallQueryValid = isQueryValidInternal;
