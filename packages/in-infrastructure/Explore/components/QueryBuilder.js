import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';
import getTagCatalog from 'in-infrastructure/subscriptions/getTagCatalog';

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: getTagCatalog,
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
