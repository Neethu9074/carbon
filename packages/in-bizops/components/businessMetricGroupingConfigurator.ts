/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetBusinessMetricsTagsSuggestionsQuery } from '@instana/types/typeDefinitions';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { createDynamicGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getBusinessMetricTagSuggestions from 'in-bizops/subscriptions/getBusinessMetricTagSuggestions';
import getBusinessMetricsTagsCatalog from 'in-bizops/subscriptions/getBusinessMetricsTagsCatalog';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';

interface GetTagCatalogProps {
  metric: string;
  timeConfig: TimeConfig;
}

const { GroupingConfigurator } = createDynamicGroupingConfigurator<{ metric: string }>({
  getTagCatalog: ({ metric, timeConfig }: GetTagCatalogProps) =>
    getBusinessMetricsTagsCatalog({
      metricName: metric,
      timeConfig: timeConfig
    }),
  getSuggestions: (params: GetTagSuggestionsProps) => {
    const { timeConfig, propose, key, value } = params;
    const query: GetBusinessMetricsTagsSuggestionsQuery = {
      // TODO:  Need to pass metric in from the grouping configurator,
      // but the prop doesn't currently exist.
      metric: 'metric',
      propose: propose,
      key: key,
      value: value,
      timeConfig: timeConfig,
      pagination: {
        page: 1,
        pageSize: 50
      }
    };
    return getBusinessMetricTagSuggestions(query);
  },
  disableEntitySelection: true
});

export default GroupingConfigurator;
