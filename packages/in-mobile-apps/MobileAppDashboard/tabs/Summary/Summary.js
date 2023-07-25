/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import HttpRequestOriginTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/HttpRequestOriginTopList';
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
import MobileAppBigNumberCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppBigNumberCard';
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/ViewsTopList';
import CrashTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/CrashTopList';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import { summaryTab, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { mobileAppCrashBeaconEnabled } from 'in-services/featureFlags';
import { number, percentage } from 'in-services/formatters/number';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ tagFilters, timeConfig, mobileAppId, mobileAppLabel, viewId }) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const granularity = getChartGranularity(timeConfig);
  const tagCatalogSessionStart = useTagCatalog('sessionStart');
  const tagCatalogViewChange = useTagCatalog('viewChange');
  const tagCatalogCrash = useTagCatalog('crash');
  const MarkerLane = MobileAppMarkerLane({ mobileAppId });

  return (
    <Fragment>
      <Row>
        <Col xs>
          <MobileAppBigNumberCard
            title={t('in-mobile-apps:dashboard.tabs.sessionStartsTitle')}
            metric={'sessions'}
            aggregation={'SUM'}
            formatter={number.compact}
            companionMetric={'uniqueUsers'}
            companionAggregation={'DISTINCT_COUNT'}
            companionFormatter={v =>
              t('in-mobile-apps:dashboard.tabs.uniqueUserCount', {
                formattedCount: number.compact(v),
                count: v
              })
            }
            comparisonColors={{
              comparisonDecreaseColor: blue.id,
              comparisonIncreaseColor: blue.id
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
        </Col>
        <Col xs>
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
        </Col>
        {mobileAppCrashBeaconEnabled && (
          <Col xs>
            <MobileAppBigNumberCard
              title={t('in-mobile-apps:dashboard.tabs.crashFreeSessionRateTitle')}
              metric={'crashFreeSessionRate'}
              aggregation={'MEAN'}
              formatter={percentage.detailed}
              companionMetric={'sessions'}
              companionAggregation={'SUM'}
              companionFormatter={v =>
                t('in-mobile-apps:dashboard.tabs.sessionCount', {
                  formattedCount: number.compact(v),
                  count: v
                })
              }
              comparisonColors={{
                comparisonDecreaseColor: blue.id,
                comparisonIncreaseColor: blue.id
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
                      groupbyTag: 'mobileBeacon.error.message'
                    }
                  })
              }}
            />
          </Col>
        )}
        {mobileAppCrashBeaconEnabled && (
          <Col xs>
            <MobileAppBigNumberCard
              title={t('in-mobile-apps:dashboard.tabs.crashFreeUserRateTitle')}
              metric={'crashFreeUserRate'}
              aggregation={'MEAN'}
              formatter={percentage.detailed}
              companionMetric={'uniqueUsers'}
              companionAggregation={'DISTINCT_COUNT'}
              companionFormatter={v =>
                t('in-mobile-apps:dashboard.tabs.uniqueUserCount', {
                  formattedCount: number.compact(v),
                  count: v
                })
              }
              comparisonColors={{
                comparisonDecreaseColor: blue.id,
                comparisonIncreaseColor: blue.id
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
                      groupbyTag: 'mobileBeacon.error.message'
                    },
                    fields: [
                      {
                        metricId: 'uniqueUsers',
                        aggregationId: 'DISTINCT_COUNT',
                        type: metricType
                      }
                    ],
                    chartedMetrics: [
                      {
                        metricId: 'uniqueUsers',
                        aggregationId: 'DISTINCT_COUNT'
                      }
                    ]
                  })
              }}
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={mobileAppCrashBeaconEnabled ? 8 : 12}>
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
        {mobileAppCrashBeaconEnabled && (
          <Col lg={4}>
            <CrashTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'occurrenceTab' }}
              renderHistoricDataIndicator
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={viewId == null ? 4 : 6}>
          <Card title={t('in-mobile-apps:dashboard.tabs.geographyTitle')} withoutPadding>
            <MobileAppGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <HttpRequestOriginTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            mobileAppId={mobileAppId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'originsTab' }}
            renderHistoricDataIndicator
          />
        </Col>
        {viewId == null && (
          <Col lg={4}>
            <ViewsTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              mobileAppId={mobileAppId}
              renderHistoricDataIndicator
            />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
