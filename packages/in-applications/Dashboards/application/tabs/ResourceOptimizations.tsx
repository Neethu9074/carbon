/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { BoundaryScope, TimeConfig } from '@instana/types';

//@ts-expect-error needs TS migration
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import { useResourceOptimization, useTurboRecommendedActions } from 'in-automation/AutomationCard/useScoredActions';
import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { generateMetrics, fixedTimestamp } from 'in-test/util/generateMetrics';
import { FormatterObject, MetricDataSeries } from 'in-components/Chart/types';
import { resourceOptimizationsTab } from 'in-applications/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { chartColors } from 'in-themes/chartColors';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './ResourceOptimizations.mless';

type tabProps = {
  applicationId: string;
  timeConfig: TimeConfig;
  boundaryScope: BoundaryScope;
};

export default function ResourceOptimizationTab({ applicationId, timeConfig, boundaryScope }: tabProps) {
  const recommendedOptimizations = useResourceOptimization({ applicationId });
  const turboRecommendedActions = useTurboRecommendedActions(recommendedOptimizations);
  const colorPalette = [
    chartColors.fiveColorPalette[1],
    chartColors.fiveColorPalette[2],
    chartColors.fiveColorPalette[0],
    chartColors.fiveColorPalette[3],
    chartColors.fiveColorPalette[4]
  ];

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const granularity = getChartGranularity(timeConfig);

  function generateTimeframe(windowSize: number) {
    return {
      windowSize,
      to: fixedTimestamp,
      autoRefresh: false
    };
  }
  function generateMultipleMetrics(numSeries: number, numMetrics: number, maxValue: number, windowSize: number) {
    const series = [];
    for (let i = 0; i < numSeries; i++) {
      series[i] = generateMetrics(numMetrics, maxValue, windowSize) as MetricDataSeries;
    }
    return series;
  }

  let tagFilters = [
    boundaryScope === boundaryScopes.all
      ? { stringValue: applicationId, name: 'application.id', entity: DESTINATION, operator: EQUALS }
      : {
          stringValue: applicationId,
          name: 'boundary.application.id',
          entity: NOT_APPLICABLE,
          operator: EQUALS
        }
  ];

  return (
    <div className={locals.contentContainer}>
      <InfoPanel
        content={{
          //text not finalized, no i18n yet
          title: 'Resource optimizations, powered by Turbonomic',
          columns: [
            {
              title: 'Set up integration',
              text: 'You can automate actions to comply with service level objectives and improve business efficiency.',
              link: {
                url: '#',
                label: 'Set up'
              }
            },
            {
              title: 'Upgrade to Instana Premium',
              text: 'You can automate actions to comply with service levels and improve business efficiency.',
              link: {
                url: '#',
                label: 'Upgrade'
              }
            },
            {
              title: 'View documentation',
              text: 'You can automate actions to comply with service levels and improve business efficiency.',
              link: {
                url: '#',
                label: 'View docs'
              }
            }
          ]
        }}
      />
      <div className={locals.charts}>
        <div className={locals.box1}>
          <ResultAwareChart
            result={success({})}
            config={{
              title: t('in-automation:actionCategory'),
              timeConfig: generateTimeframe(oneMinute),
              y1: {
                renderer: Renderer.pie,
                labels: ['Performance', 'Prevention', 'Efficiency', 'Savings', 'Compliance'],
                metricIds: [],
                metrics: generateMultipleMetrics(5, 30, 10, oneMinute),

                colors: colorPalette,
                formatter: ((x: any) => x) as unknown as FormatterObject
              }
            }}
          />
        </div>
        <div style={{ width: '65%', height: '295', display: 'none' }}>
          <ResultAwareChart
            result={success({})}
            config={{
              extendBar: true,
              granularity: granularity,
              title: 'Action types',
              timeConfig: timeConfig,
              y1: {
                renderer: Renderer.bar,
                labels: ['Type'],
                metricIds: ['Move', 'Buy', 'Save'],
                metrics: [generateMetrics(12, 100, oneMinute) as MetricDataSeries],
                colors: colorPalette
              }
            }}
          />
        </div>
        <div className={locals.box2}>
          <LatencyAndDistribution
            cardTitle={t('in-applications:labelLatency')}
            applicationId={applicationId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
            tagFilters={tagFilters}
            percentileGroupBy={createGroupBy('service.name', DESTINATION)}
            renderPostChartContent={() => {}}
            urlMatrixParamConfig={{
              path: resourceOptimizationsTab,
              paramTab: 'latencyTab',
              paramMetric: 'latencyMetric'
            }}
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
          />
        </div>
      </div>
      <RecommendedOptimizations
        recommendedActions={turboRecommendedActions}
        totalRecommendedActions={recommendedOptimizations?.data?.totalRecommendedActionsCount}
      />
    </div>
  );
}
