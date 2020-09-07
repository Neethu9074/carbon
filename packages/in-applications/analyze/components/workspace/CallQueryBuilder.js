import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: getApplicationTagCatalog,
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default QueryBuilder;

export const isCallQueryValid = isQueryValidInternal;
