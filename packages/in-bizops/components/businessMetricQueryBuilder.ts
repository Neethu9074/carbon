/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetBusinessMetricsTagsSuggestionsQuery } from '@instana/types/typeDefinitions';

import getBusinessMetricTagSuggestions from 'in-bizops/subscriptions/getBusinessMetricTagSuggestions';
import getBusinessMetricsTagsCatalog from 'in-bizops/subscriptions/getBusinessMetricsTagsCatalog';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder } = createDynamicQueryBuilder<
  { metric: string }, // additional tag suggestions props
  { metric: string } // additional tag catalog props
>({
  getTagCatalog: ({ metric, timeConfig }) =>
    getBusinessMetricsTagsCatalog({
      metricName: metric,
      timeConfig: timeConfig
    }),
  getSuggestions: ({ tagName, timeConfig, propose, value, metric }) => {
    const query: GetBusinessMetricsTagsSuggestionsQuery = {
      metric: metric,
      propose: propose,
      key: tagName,
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

export default QueryBuilder;
