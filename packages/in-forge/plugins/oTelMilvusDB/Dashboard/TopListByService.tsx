/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { TimeConfig, AggregationType, Grouping } from '@instana/types';

import { useObservable } from '@instana/hooks';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
 // @ts-expect-error Module needs to be translated to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface TopListByServiceProps {
  title: string;
  metricName: string;
  tag: string;
  tagFilter: string;
  formatter: string;
  actions?: React.ReactNode;
  dragHandle?: React.ReactNode;
}

// Define a more flexible type for the metrics configuration
interface MetricConfig {
  formatter: string;
  metricConfiguration: {
    formatter: string;
    aggregation: AggregationType;
    metric: string;
    source: string;
    timeShift: number;
    tagFilterExpression: {
      name: string;
      type: string;
      value: string;
      entity: string;
      operator: string;
    };
    allowedCrossSeriesAggregations: AggregationType[];
    crossSeriesAggregation: string;
    type: string;
    metricPath: string[];
    grouping: Grouping[];
  };
  formatterSelected: boolean;
}

export default function TopListByService({ 
  title, 
  metricName, 
  tag, 
  tagFilter, 
  formatter, 
  actions, 
  dragHandle 
}: TopListByServiceProps): JSX.Element {
  const timeConfig = useTimeConfig();
  const tagCatalog = useTagCatalog(getTagCatalog);

  const config: MetricConfig = {
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
      type: 'oTelMilvusDB',
      metricPath: ['Others', 'OpenTelemetry SDK Milvus DB'],
      grouping: [
        {
          maxResults: 10,
          by: {
            groupbyTag: tag,
            groupbyTagEntity: 'DESTINATION',
            groupbyTagSecondLevelKey: ''
          },
          includeOthers: false,
          includeUnmatched: false,
          direction: 'DESC'
        }
      ]
    },
    formatterSelected: false
  };

  const result = useResultData(config, timeConfig) ?? pendingResult;

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

function useResultData(config: MetricConfig, timeConfig: TimeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);
  
  // Use type assertion to work around type issues
  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER',
      regex: false
    }
  } as { [key: string]: any };
  
  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig]);
}
