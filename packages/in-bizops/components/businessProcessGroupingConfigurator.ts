/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getBizOpsTagSuggestions from 'in-bizops/subscriptions/getBizOpsTagSuggestions';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { GetBizOpsTagSuggestionQuery } from 'in-bizops/utils/types';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';

const { GroupingConfigurator } = createGroupingConfigurator({
  getTagCatalog: () => getBusinessMonitoringTagCatalog({ useCase: 'GROUPING' }),
  getSuggestions: (params: GetTagSuggestionsProps) => {
    const { tagFilterExpression, tagName, timeConfig, propose, key, value, entity } = params;
    const query: GetBizOpsTagSuggestionQuery = {
      entity: entity,
      tagFilterExpression: tagFilterExpression,
      tagName: tagName,
      propose: propose,
      key: key,
      value: value,
      timeConfig: timeConfig
    };
    return getBizOpsTagSuggestions(query);
  }
});

export default GroupingConfigurator;
