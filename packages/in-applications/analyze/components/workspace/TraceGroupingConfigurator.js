import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { getTraceGroupTagKeys } from 'in-applications/tags.js';
import { TRACES } from 'in-applications/analyze/metrics';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: TRACES })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: filterTraceGroupTree(response.data.tagTree)
      }
    })),
  getSuggestions: () => {}
});

function filterTraceGroupTree(tree) {
  return tree
    .map(element => {
      if (element.type === 'LEVEL') {
        const children = filterTraceGroupTree(element.children).filter(Boolean);
        return children.length > 0 && { ...element, children: children };
      }
      return getTraceGroupTagKeys().includes(element.tagName) && element;
    })
    .filter(Boolean);
}

export default GroupingConfigurator;

export const isTraceGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
