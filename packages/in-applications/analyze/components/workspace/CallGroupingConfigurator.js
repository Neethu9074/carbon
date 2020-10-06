import filteredTree from 'in-applications/analyze/components/workspace/TagCatalogFilteredTree';
import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { successObservableFactory } from 'in-services/util/result';
const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: 'CALLS' })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: filteredTree(response.data.tagTree, response.data.tags, false)
      }
    })),
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

export default GroupingConfigurator;

export const isCallGroupingConfigurationValid = isGroupingConfigurationValidInternal;
