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

interface GetMetricTagSuggestionsProps extends GetTagSuggestionsProps {
  metric: string;
}

const { GroupingConfigurator } = createDynamicGroupingConfigurator<{ metric: string }>({
  getTagCatalog: ({ metric, timeConfig }: GetTagCatalogProps) =>
    getBusinessMetricsTagsCatalog({
      metricName: metric,
      timeConfig: timeConfig
    }),
  getSuggestions: (params: GetMetricTagSuggestionsProps) => {
    const { timeConfig, propose, key, value, metric } = params;
    const query: GetBusinessMetricsTagsSuggestionsQuery = {
      metric: metric,
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
