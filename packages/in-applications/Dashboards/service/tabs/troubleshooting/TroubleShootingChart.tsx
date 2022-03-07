/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
// @ts-expect-error
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { createMetricField } from 'in-analyze/navigation/paths';
import { Group, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export interface TroubleShootingChartProps {
  title: string;
  explanation?: string;
  serviceId: string;
  metricConfig: {};
  groupBy: Group;
  boundaryScope: string;
  syntheticCalls: string;
}

export default function TroubleShootingChart({
  title,
  explanation,
  groupBy,
  serviceId,
  metricConfig,
  boundaryScope,
  syntheticCalls
}: TroubleShootingChartProps) {
  const hiddenCalls = createHiddenCallsFromSyntheticOption(syntheticCalls);

  return (
    <UnifiedMetricsChart
      title={title}
      rightHeaderContent={explanation && <i>{explanation}</i>}
      automaticallySize={false}
      renderLegend
      config={{
        y1: {
          metrics: [metricConfig],
          formatter: 'number.compact',
          renderer: 'line'
        },
        type: 'TIME_SERIES',
        additionalContextMenuButtons: [
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: (highlightedTime: TimeConfig) => {
              return getJumpToAnalyzeHref$(
                { serviceId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupBy: groupBy,
                  formModel: createFormModelFromSyntheticOption(syntheticCalls),
                  hiddenCalls,
                  fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')]
                }
              );
            }
          }
        ]
      }}
    />
  );
}
