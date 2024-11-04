/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BoundaryScope, TimeConfig, TurboActionCategory } from '@instana/types';

//@ts-expect-error needs TS migration
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import {
  useResourceOptimization,
  useTurboRecommendedActions
} from 'in-automation/ResourceOptimization/useResourceOptimization';
import OptimizationsButtonGroup, {
  useActiveOptimizationsKey
} from 'in-automation/AutomationCard/OptimizationsButtonGroup';
import { useResourceActionHistoryCount } from 'in-automation/ResourceOptimization/useResourceOptimization';
import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import { FormatterObject, MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { resourceOptimizationsTab } from 'in-applications/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { fixedTimestamp } from 'in-test/util/generateMetrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { chartColors } from 'in-themes/chartColors';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ResourceOptimizations.mless';

type ResourceOptimizationTabProps = {
  applicationId: string;
  timeConfig: TimeConfig;
  boundaryScope: BoundaryScope;
};

const colorPalette = [
  chartColors.fiveColorPalette[1],
  chartColors.fiveColorPalette[2],
  chartColors.fiveColorPalette[0],
  chartColors.fiveColorPalette[3],
  chartColors.fiveColorPalette[4]
];

const showGuidance = false;

function generateTimeframe(windowSize: number) {
  return {
    windowSize,
    to: fixedTimestamp,
    autoRefresh: false
  };
}

export default function ResourceOptimizationTab({
  applicationId,
  timeConfig,
  boundaryScope
}: ResourceOptimizationTabProps) {
  const recommendedOptimizations = useResourceOptimization({ applicationId });
  const turboRecommendedActions = useTurboRecommendedActions(recommendedOptimizations);
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

  let pieLabels: string[] = [];
  let pieMetrics: MetricDataSeries[] = [];
  let actionCategories = recommendedOptimizations?.data?.actionCategoriesCount;
  if (actionCategories) {
    pieLabels = Object.keys(actionCategories);
    pieMetrics = pieLabels.map(x => {
      let dataPoint = [];
      dataPoint.push([0, actionCategories ? actionCategories[x as TurboActionCategory] : 0] as MetricDataPoint);
      return dataPoint;
    });
    pieLabels = pieLabels.map(x => (x.indexOf('_') === -1 ? x : x.substring(0, x.indexOf('_')))); //Display labels before "_" only
  }

  const activeOptimizatonsKey = useActiveOptimizationsKey();
  const historyCount = useResourceActionHistoryCount({ types: ['EXTERNAL'] });

  return (
    <div className={locals.contentContainer}>
      {showGuidance && (
        <InfoPanel
          content={{
            //The text is not approved in time for the release, so do not put them in i18n files. The infoPanel is not displayed for now.
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
      )}
      <div className={locals.charts}>
        <div className={locals.categoriesChart}>
          <ResultAwareChart
            result={recommendedOptimizations}
            config={{
              customHeight: 256,
              customChartSkeletonHeight: 200,
              title: t('in-automation:actionCategory'),
              timeConfig: generateTimeframe(minutes.toMillis(1)), //Not meaningful, but seems required.
              y1: {
                renderer: recommendedOptimizations?.progress?.loading ? Renderer.area : Renderer.pie,
                labels: pieLabels,
                metricIds: [],
                metrics: pieMetrics,
                colors: colorPalette,
                formatter: ((x: any) => x) as unknown as FormatterObject
              }
            }}
          />
        </div>
        <div className={locals.latencyAndDistributionChart}>
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
            customChartSkeletonHeight={200}
          />
        </div>
      </div>
      <OptimizationsButtonGroup
        recommendedOptimizationsCount={recommendedOptimizations?.data?.totalRecommendedActionsCount!}
        optimizationHistoryCount={historyCount}
      />
      {activeOptimizatonsKey === 'recommendedOptimizations' && (
        <RecommendedOptimizations
          recommendedActions={turboRecommendedActions}
          totalRecommendedActions={recommendedOptimizations?.data?.totalRecommendedActionsCount}
        />
      )}
      {activeOptimizatonsKey === 'optimizationHistory' && (
        <ActionHistoryTable
          cardTitle={
            historyCount !== undefined
              ? t('in-automation:resourceOptimization.recommendedActionHistoryWithCount', {
                  count: historyCount
                })
              : t('in-automation:resourceOptimization.recommendedActionHistory')
          }
          customActionTypes={['EXTERNAL']}
          noFilters
          noEvent
        />
      )}
    </div>
  );
}
