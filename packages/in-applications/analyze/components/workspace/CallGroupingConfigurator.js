import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { successObservableFactory } from 'in-services/util/result';
import { CALLS } from 'in-applications/analyze/metrics';
const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: CALLS, useCase: 'GROUPING' })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: response.data.tagTree
      }
    })),
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default GroupingConfigurator;

export const isCallGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
