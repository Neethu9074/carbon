import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { successObservableFactory } from 'in-services/util/result';

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: getApplicationTagCatalog,

  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default GroupingConfigurator;

export const isCallGroupingConfigurationValid = isGroupingConfigurationValidInternal;
