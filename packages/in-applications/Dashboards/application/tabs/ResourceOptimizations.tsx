/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BoundaryScope, TimeConfig, TurboActionCategory, Application } from '@instana/types';

import {
  AUTOMATION_TURBO_BUY_CLICK,
  AUTOMATION_TURBO_SUPPORT_CLICK,
  AUTOMATION_TURBO_TRY_CLICK
} from 'in-services/tracking/eventNames';
//@ts-expect-error needs TS migration
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import RecommendedActionsWithHistory from 'in-automation/ResourceOptimization/RecommendedActionsWithHistory';
import { useResourceOptimization } from 'in-automation/ResourceOptimization/useResourceOptimization';
import { FormatterObject, MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { resourceOptimizationsTab } from 'in-applications/navigation/paths';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { fixedTimestamp } from 'in-test/util/generateMetrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { solisEnabled } from 'in-services/featureFlags';
import { chartColors } from 'in-themes/chartColors';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ResourceOptimizations.mless';

type ResourceOptimizationTabProps = {
  applicationId: string;
  timeConfig: TimeConfig;
  data: Application;
  boundaryScope: BoundaryScope;
};

type RenderActionsLaneProps = {
  applicationId: string;
  serviceId?: string;
  endpointId?: string;
  boundaryScope?: BoundaryScope;
};

const colorPalette = [
  chartColors.fiveColorPalette[1],
  chartColors.fiveColorPalette[2],
  chartColors.fiveColorPalette[0],
  chartColors.fiveColorPalette[3],
  chartColors.fiveColorPalette[4]
];

function generateTimeframe(windowSize: number) {
  return {
    windowSize,
    to: fixedTimestamp,
    autoRefresh: false
  };
}

function renderActionsLane({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  ...remainingProps
}: RenderActionsLaneProps) {
  return function MarkerLanesApplications(lanesProps: any) {
    return (
      <MarkerLanesPresenter {...lanesProps}>
        <ActionsLane
          applicationId={applicationId}
          {...lanesProps}
          {...remainingProps}
          serviceId={serviceId}
          endpointId={endpointId}
          boundaryScope={boundaryScope}
        />
      </MarkerLanesPresenter>
    );
  };
}

export default function ResourceOptimizationTab({
  applicationId,
  timeConfig,
  data: application,
  boundaryScope: urlBoundaryScope
}: ResourceOptimizationTabProps) {
  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  const recommendedOptimizations = useResourceOptimization({ applicationId });
  const postChartContent = renderActionsLane({ applicationId, boundaryScope });
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

  return (
    <div className={locals.contentContainer}>
      {!solisEnabled && (
        <InfoPanel
          expanded="showResourceActionInfoPanel"
          content={{
            title: t('in-applications:infoBanner.title'),
            columns: [
              {
                title: t('in-applications:infoBanner.tryLabel'),
                text: t('in-applications:infoBanner.tryText'),
                link: {
                  url: 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52198&launch=Instana',
                  label: t('in-applications:infoBanner.tryButtonLabel'),
                  trackKey: AUTOMATION_TURBO_TRY_CLICK
                }
              },
              {
                title: t('in-applications:infoBanner.learnLabel'),
                text: t('in-applications:infoBanner.learnText'),
                link: {
                  url: 'https://www.ibm.com/products/instana/automated-resource-optimization',
                  label: t('in-applications:infoBanner.learnButtonLabel')
                }
              },
              {
                title: t('in-applications:infoBanner.connectLabel'),
                text: t('in-applications:infoBanner.connectText'),
                link: {
                  url: 'https://www.ibm.com/account/reg/us-en/signup?formid=MAIL-automateinstana',
                  label: t('in-applications:infoBanner.connectButtonLabel'),
                  trackKey: AUTOMATION_TURBO_BUY_CLICK
                }
              },
              {
                title: t('in-applications:infoBanner.helpLabel'),
                text: t('in-applications:infoBanner.helpText'),
                link: {
                  url: 'https://your.feedback.ibm.com/jfe/form/SV_eLsdmgUrNwcTrpQ',
                  label: t('in-applications:infoBanner.helpButtonLabel'),
                  trackKey: AUTOMATION_TURBO_SUPPORT_CLICK
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
            renderPostChartContent={postChartContent}
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
      <RecommendedActionsWithHistory recommendedActions={recommendedOptimizations} />
    </div>
  );
}
