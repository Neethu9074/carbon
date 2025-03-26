/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function TopListByModel({ title, metricName, tag, tagFilter, formatter, actions, dragHandle }) {
  const timeConfig = useTimeConfig();
  let tagCatalog = useTagCatalog(getTagCatalog);

  const config = {
    formatter: formatter,
    metricConfiguration: {
      formatter: formatter,
      aggregation: 'SUM',
      metric: metricName,
      source: 'INFRASTRUCTURE_METRICS',
      timeShift: 0,
      tagFilterExpression: {
        name: 'otel.attribute.service.instance.id',
        type: 'TAG_FILTER',
        value: tagFilter,
        entity: 'NOT_APPLICABLE',
        operator: 'EQUALS'
      },
      allowedCrossSeriesAggregations: [],
      crossSeriesAggregation: 'SUM',
      type: 'oTelVLLM',
      metricPath: ['Others', 'OpenTelemetry SDK vLLM'],
      grouping: [
        {
          maxResults: 10,
          by: {
            groupbyTag: tag,
            groupbyTagEntity: 'DESTINATION',
            groupbyTagSecondLevelKey: ''
          },
          includeOthers: false,
          direction: 'DESC'
        }
      ]
    },
    formatterSelected: false
  };

  let result = useResultData(config, timeConfig) ?? pendingResult;

  return (
    <ListWidgetRenderer
      title={title}
      result={result}
      isErroneous="false"
      tagCatalog={tagCatalog}
      config={config}
      actions={actions}
      dragHandle={dragHandle}
    />
  );
}

function useResultData(config, timeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);
  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER'
    }
  };
  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig]);
}
