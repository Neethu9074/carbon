import { find } from 'lodash';

import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { successObservableFactory } from 'in-services/util/result';

const suggestions = ['k8s-demo-cluster', 'sb-test-cluster', 'kube-node-lease', 'kube-public'];

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props =>
    getApplicationTagCatalog(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: filteredTree(response.data.tagTree, response.data.tags)
      }
    })),
  getSuggestions: successObservableFactory({ suggestions, totalHits: suggestions.length + 10 })
});

function filteredTree(tree, tags) {
  return tree
    .map(element => {
      if (element.type === 'LEVEL') {
        const children = filteredTree(element.children, tags).filter(Boolean);
        return children.length > 0 && { ...element, children: children };
      }
      return find(tags, tag => tag.name === element.tagName && tag.allowGroupingForCalls) && element;
    })
    .filter(Boolean);
}

export default GroupingConfigurator;

export const isCallGroupingConfigurationValid = isGroupingConfigurationValidInternal;
