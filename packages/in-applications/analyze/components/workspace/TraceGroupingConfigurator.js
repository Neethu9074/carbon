import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { TRACES } from 'in-applications/analyze/metrics';

const {
  getTagCatalog: getTagCatalogInternal,
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: TRACES, useCase: 'GROUPING' })(props),
  getSuggestions: () => {}
});

export default GroupingConfigurator;

export const getGroupingTagCatalog = getTagCatalogInternal;

export const isTraceGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
