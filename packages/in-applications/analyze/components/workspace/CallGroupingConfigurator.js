import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { CALLS } from 'in-applications/analyze/metrics';

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
  getSuggestions: args => {
    return getTagSuggestions({
      entity: args.entity,
      propose: args.propose,
      tagFilterExpression: args.tagFilterExpression,
      tagName: args.name,
      value: args.value,
      filter: {
        timeConfig: args.timeConfig
      }
    });
  }
});

export default GroupingConfigurator;

export const isCallGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
