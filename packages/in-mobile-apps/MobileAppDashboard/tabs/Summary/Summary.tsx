/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Spacer } from '@instana/components';
import { Card } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
// @ts-expect-error Could not find a declaration file for module
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
// @ts-expect-error Could not find a declaration file for module
import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { mobileAppCrashBeaconEnabled, mobileAppScreenRenderingDurationEnabled } from 'in-services/featureFlags';
import HttpRequestOriginTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/HttpRequestOriginTopList';
import MobileAppBigNumberCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppBigNumberCard';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/ViewsTopList';
import CrashTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/CrashTopList';
import { summaryTab, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { number, percentage, ms } from 'in-services/formatters/number';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import { carbonAlert } from 'in-themes/chartColors';
import { TimeConfig, TagFilter } from 'in-types';
import { t } from 'in-i18n';

interface SummaryProp {
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  mobileAppId: string;
  mobileAppLabel: string;
  viewId?: string;
}

export default function Summary({ tagFilters, timeConfig, mobileAppId, mobileAppLabel, viewId }: SummaryProp) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const granularity = getChartGranularity(timeConfig);
  const tagCatalogSessionStart = useTagCatalog('sessionStart');
  const tagCatalogViewChange = useTagCatalog('viewChange');
  const tagCatalogCrash = useTagCatalog('crash');
  const MarkerLane = MobileAppMarkerLane({ mobileAppId });
  const thinWidgetWidth = viewId == null ? 4 : 6;

  function setSizeKPICard(viewId: string | undefined) {
    if (mobileAppScreenRenderingDurationEnabled) {
      if (viewId) return [3, 3, 3, 3];
      else return mobileAppCrashBeaconEnabled ? [2, 2, 2, 3, 3] : [4, 4, 4];
    } else return mobileAppCrashBeaconEnabled ? [2, 2, 2, 3, 3] : [4, 4, 4];
  }
  const screenRend = (
    <MobileAppMetricsKpiCard
      title={t('in-mobile-apps:dashboard.tabs.screenRenderingDurationKPICard')}
      formatter={ms.compact}
      metricsConfig={{
        tagFilters,
        timeConfig,
        metrics: {
          beaconDuration: {
            metric: 'beaconDuration',
            aggregation: 'P75'
          }
        }
      }}
      iconAction={{
        text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href:
          tagCatalogViewChange &&
          getLinkToMobileAppAnalyze({
            beaconType: 'viewChange',
            formModel: translateDemocratisationTagFiltersToFormModel({
              mobileAppLabel,
              tagFilters,
              tagCatalog: tagCatalogViewChange
            }),
            groupBy: {
              groupbyTag: 'mobileBeacon.view.name'
            },
            fields: [
              {
                metricId: 'beaconDuration',
                aggregationId: 'P75',
                type: metricType
              }
            ],
            chartedMetrics: [
              {
                metricId: 'beaconDuration',
                aggregationId: 'P75'
              }
            ]
          })
      }}
    />
  );

  const crashAffectedSessionRate = (
    <MobileAppBigNumberCard
      title={t('in-mobile-apps:dashboard.tabs.crashAffectedSessionRateTitle')}
      metric={'crashAffectedSessionRate'}
      aggregation={'MEAN'}
      formatter={percentage.detailed}
      companionMetric={'crashAffectedSessionCount'}
      companionAggregation={'DISTINCT_COUNT'}
      companionFormatter={v =>
        t('in-mobile-apps:dashboard.tabs.sessionCount', {
          formattedCount: number.compact(v),
          count: v
        })
      }
      comparisonColors={{
        decreaseColor: blue.id,
        increaseColor: blue.id
      }}
      tagFilters={tagFilters}
      timeConfig={timeConfig}
      iconAction={{
        text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href:
          tagCatalogCrash &&
          getLinkToMobileAppAnalyze({
            beaconType: 'crash',
            formModel: translateDemocratisationTagFiltersToFormModel({
              mobileAppLabel,
              tagFilters,
              tagCatalog: tagCatalogCrash
            }),
            groupBy: {
              groupbyTag: 'mobileBeacon.crash.groupLabel'
            }
          })
      }}
    />
  );

  const crashAffectedUserRate = (
    <MobileAppBigNumberCard
      title={t('in-mobile-apps:dashboard.tabs.crashAffectedUserRateTitle')}
      metric={'crashAffectedUserRate'}
      aggregation={'MEAN'}
      formatter={percentage.detailed}
      companionMetric={'crashAffectedUserCount'}
      companionAggregation={'DISTINCT_COUNT'}
      companionFormatter={v =>
        t('in-mobile-apps:dashboard.tabs.uniqueUserCount', {
          formattedCount: number.compact(v),
          count: v
        })
      }
      comparisonColors={{
        decreaseColor: blue.id,
        increaseColor: blue.id
      }}
      tagFilters={tagFilters}
      timeConfig={timeConfig}
      iconAction={{
        text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href:
          tagCatalogCrash &&
          getLinkToMobileAppAnalyze({
            beaconType: 'crash',
            formModel: translateDemocratisationTagFiltersToFormModel({
              mobileAppLabel,
              tagFilters,
              tagCatalog: tagCatalogCrash
            }),
            groupBy: {
              groupbyTag: 'mobileBeacon.crash.groupLabel'
            },
            fields: [
              {
                metricId: 'uniqueUsersOrSessions',
                aggregationId: 'DISTINCT_COUNT',
                type: metricType
              }
            ],
            chartedMetrics: [
              {
                metricId: 'uniqueUsersOrSessions',
                aggregationId: 'DISTINCT_COUNT'
              }
            ]
          })
      }}
    />
  );

  return (
    <Fragment>
      <KpiGridRow sizes={setSizeKPICard(viewId)}>
        <MobileAppBigNumberCard
          title={t('in-mobile-apps:dashboard.tabs.sessionStartsTitle')}
          metric={'sessions'}
          aggregation={'SUM'}
          formatter={number.compact}
          comparisonColors={{
            decreaseColor: blue.id,
            increaseColor: blue.id
          }}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogSessionStart &&
              getLinkToMobileAppAnalyze({
                beaconType: 'sessionStart',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters,
                  tagCatalog: tagCatalogSessionStart
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.view.name'
                }
              })
          }}
        />

        <MobileAppMetricsKpiCard
          title={t('in-mobile-apps:dashboard.tabs.uniqueUsersTitle')}
          formatter={number.compact}
          metricsConfig={{
            tagFilters,
            timeConfig,
            metrics: {
              uniqueUsersOrSessions: {
                metric: 'uniqueUsersOrSessions',
                aggregation: 'DISTINCT_COUNT'
              }
            }
          }}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogSessionStart &&
              getLinkToMobileAppAnalyze({
                beaconType: 'sessionStart',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters,
                  tagCatalog: tagCatalogSessionStart
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.view.name'
                },
                fields: [
                  {
                    metricId: 'uniqueUsersOrSessions',
                    aggregationId: 'DISTINCT_COUNT',
                    type: metricType
                  }
                ],
                chartedMetrics: [
                  {
                    metricId: 'uniqueUsersOrSessions',
                    aggregationId: 'DISTINCT_COUNT'
                  }
                ]
              })
          }}
        />

        <MobileAppMetricsKpiCard
          title={t('in-mobile-apps:dashboard.tabs.viewTransitionsTitle')}
          formatter={number.compact}
          metricsConfig={{
            tagFilters,
            timeConfig,
            metrics: {
              sessions: {
                metric: 'views',
                aggregation: 'SUM'
              }
            }
          }}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogViewChange &&
              getLinkToMobileAppAnalyze({
                beaconType: 'viewChange',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters,
                  tagCatalog: tagCatalogViewChange
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.view.name'
                }
              })
          }}
        />

        {[viewId && mobileAppScreenRenderingDurationEnabled && screenRend].filter(Boolean)}

        {viewId == null
          ? crashAffectedSessionRate
          : viewId && !mobileAppScreenRenderingDurationEnabled
          ? crashAffectedSessionRate
          : null}

        {viewId == null
          ? crashAffectedUserRate
          : viewId && !mobileAppScreenRenderingDurationEnabled
          ? crashAffectedUserRate
          : null}
      </KpiGridRow>

      {viewId && mobileAppScreenRenderingDurationEnabled && <Spacer vertical="medium" />}
      {viewId && mobileAppScreenRenderingDurationEnabled && (
        <KpiGridRow sizes={[6, 6]}>
          {mobileAppCrashBeaconEnabled && crashAffectedSessionRate}
          {mobileAppCrashBeaconEnabled && crashAffectedUserRate}
        </KpiGridRow>
      )}

      <Row>
        <Col lg={mobileAppCrashBeaconEnabled ? thinWidgetWidth : 12}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.activityCardTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              mobileAppLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: [
                t('in-mobile-apps:dashboard.tabs.sessionStartsLabel'),
                t('in-mobile-apps:dashboard.tabs.viewTransitionsLabel')
              ],
              metricIds: ['sessions', 'views']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'sessionStart',
                  omitMetricInAnalytics: true
                },
                views: {
                  metric: 'views',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
            renderPostChartContent={MarkerLane}
          />
        </Col>
        {viewId == null && mobileAppCrashBeaconEnabled && (
          <Col lg={4}>
            <ViewsTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              mobileAppId={mobileAppId}
              urlMatrixParamConfig={
                mobileAppScreenRenderingDurationEnabled
                  ? { path: summaryTab, paramTab: 'viewsTab', paramMetric: 'views' }
                  : undefined
              }
              renderHistoricDataIndicator
            />
          </Col>
        )}
        {mobileAppCrashBeaconEnabled && (
          <Col lg={thinWidgetWidth}>
            <MobileAppChartWrapper
              title={t('in-mobile-apps:dashboard.tabs.crashActivityTitle')}
              timeConfig={timeConfig}
              viewInAnalytics={{
                mobileAppLabel
              }}
              y1={{
                renderer: Renderer.stackedBar,
                formatter: number.forcedCompact,
                labels: [t('in-mobile-apps:dashboard.tabs.crashLabel')],
                metricIds: ['crashAffectedSessionCount'],
                colors: [carbonAlert.red60]
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters,
                metrics: {
                  crashAffectedSessionCount: {
                    metric: 'crashAffectedSessionCount',
                    granularity,
                    aggregation: 'DISTINCT_COUNT',
                    beaconType: 'crash',
                    omitMetricInAnalytics: true
                  }
                }
              }}
              renderPostChartContent={MarkerLane}
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={mobileAppCrashBeaconEnabled ? 4 : thinWidgetWidth}>
          <Card title={t('in-mobile-apps:dashboard.tabs.geographyTitle')}>
            <MobileAppGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={mobileAppCrashBeaconEnabled ? 4 : thinWidgetWidth}>
          <HttpRequestOriginTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            mobileAppId={mobileAppId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'originsTab', paramMetric: 'beaconCount' }}
            renderHistoricDataIndicator
          />
        </Col>
        {viewId == null && !mobileAppCrashBeaconEnabled && (
          <Col lg={4}>
            <ViewsTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              mobileAppId={mobileAppId}
              urlMatrixParamConfig={
                mobileAppScreenRenderingDurationEnabled
                  ? { path: summaryTab, paramTab: 'viewsTab', paramMetric: 'views' }
                  : undefined
              }
              renderHistoricDataIndicator
            />
          </Col>
        )}
        {mobileAppCrashBeaconEnabled && (
          <Col lg={4}>
            <CrashTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              mobileAppId={mobileAppId}
              urlMatrixParamConfig={{
                path: summaryTab,
                paramTab: 'crashesTab',
                paramMetric: 'crashAffectedSessionCount'
              }}
              renderHistoricDataIndicator
            />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
