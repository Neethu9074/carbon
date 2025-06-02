/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { createDynamicGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getBusinessMetricsTagsCatalog from 'in-bizops/subscriptions/getBusinessMetricsTagsCatalog';
import getBizOpsTagSuggestions from 'in-bizops/subscriptions/getBizOpsTagSuggestions';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { GetBizOpsTagSuggestionQuery } from 'in-bizops/utils/types';

interface GetTagCatalogProps {
  metric: string;
  timeConfig: TimeConfig;
}

const { GroupingConfigurator } = createDynamicGroupingConfigurator<{ metric: string }>({ // additional tag catalog props
  getTagCatalog: ({ metric, timeConfig }: GetTagCatalogProps) =>
    getBusinessMetricsTagsCatalog({
      metricName: metric,
      timeConfig: timeConfig
    }),
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
