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
import { widgetPreviewHeight } from 'in-custom-dashboards/widgets/Apdex';
import { MetricDataSeries } from 'in-components/Chart/types';
import { minutes } from 'in-services/time/time';

import locals from './ApdexConfigPreview.mless';

const defaultGranularity = minutes.toMillis(1);

interface ApdexConfigPreviewProps<APDEX_ENTITY> {
  apdexEntity?: APDEX_ENTITY;
}

export default function ApdexConfigPreview<APDEX_TYPE extends ApdexPreviewEntityUnion>({
  apdexEntity
}: ApdexConfigPreviewProps<APDEX_TYPE>) {
  const timeConfig = useApdexWidgetTimeConfig(true);
  const [metricResult, , errors, progress] = useApdexPreviewMetrics({
    timeConfig,
    apdexEntity
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
