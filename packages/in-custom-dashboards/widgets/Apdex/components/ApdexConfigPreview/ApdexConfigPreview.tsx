/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useApdexPreviewMetrics, {
  ApdexPreviewEntityUnion
} from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexPreviewMetrics';
import useApdexWidgetTimeConfig from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetTimeConfig';
import ApdexChart from 'in-custom-dashboards/widgets/Apdex/components/ApdexChart';
import useDebounce from 'in-custom-dashboards/widgets/Apdex/hooks/useDebounce';
import { widgetPreviewHeight } from 'in-custom-dashboards/widgets/Apdex';
import { MetricDataSeries } from 'in-components/Chart/types';
import { minutes } from 'in-services/time/time';

import locals from './ApdexConfigPreview.mless';

const defaultGranularity = minutes.toMillis(1);

interface ApdexConfigPreviewProps {
  apdexEntity?: ApdexPreviewEntityUnion;
}

export default function ApdexConfigPreview({ apdexEntity }: ApdexConfigPreviewProps) {
  // Use debouncing to decrease render cycles and data events when entering threshold values
  const debouncedApdexEntity = useDebounce(apdexEntity);
  const timeConfig = useApdexWidgetTimeConfig(true);
  const [metricResult, , errors, progress] = useApdexPreviewMetrics({
    timeConfig,
    apdexEntity: debouncedApdexEntity
  });

  return (
    <div className={locals.wrapper}>
      <ApdexChart
        errors={errors}
        metrics={[(metricResult?.values as MetricDataSeries) ?? []]}
        progress={{ loading: progress.loading || !!errors.length }}
        granularity={metricResult?.granularity ?? defaultGranularity}
        timeConfig={{ ...timeConfig, ...metricResult?.adjustedTimeframe }}
        height={widgetPreviewHeight}
        nonInteractive
      />
    </div>
  );
}
