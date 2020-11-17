import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { TRACES } from 'in-applications/analyze/metrics';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: TRACES, useCase: 'GROUPING' })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: response.data.tagTree
      }
    })),
  getSuggestions: () => {}
});

export default GroupingConfigurator;

export const isTraceGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
