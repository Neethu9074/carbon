/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { ReactNode } from 'react';

import { Group, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { createMetricField } from 'in-analyze/navigation/paths';
import { t } from 'in-i18n';

export interface TroubleShootingChartProps {
  title: string;
  problemStatement?: string;
  renderInfoBox?: () => ReactNode;
  serviceId: string;
  metricConfigs: Metric[];
  groupBy: Group;
  boundaryScope: string;
  colorMapper?: (id: string, label: string) => string | null;
}

export default function TroubleShootingChart({
  title,
  problemStatement,
  renderInfoBox,
  groupBy,
  serviceId,
  metricConfigs,
  boundaryScope,
  colorMapper
}: TroubleShootingChartProps) {
  const isInternalVisible = useObservable(isInternalVisible$, []) || false;
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <UnifiedMetricsChart
      title={title}
      rightHeaderContent={problemStatement ? <i>{problemStatement}</i> : undefined}
      automaticallySize={false}
      renderLegend
      renderHistoricDataIndicator
      renderPostChartContent={isInternalVisible ? renderInfoBox : undefined} // only show info box in internal mode to Instana engineers
      config={{
        y1: {
          metrics: metricConfigs,
          formatter: 'number.compact',
          renderer: 'bar',
          colorMapper
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
                  fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')]
                },
                getLinkToApplicationAnalyze
              );
            }
          }
        ]
      }}
    />
  );
}
