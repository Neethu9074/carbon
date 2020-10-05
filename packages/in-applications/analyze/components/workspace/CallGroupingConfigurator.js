import { find } from 'lodash';

import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';

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
  getSuggestions: ({ name, timeConfig, entity, tagFilterExpression }) =>
    getTagSuggestions({
      tagName: name,
      filter: {
        timeConfig
      },
      entity,
      tagFilterExpression
    })
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
