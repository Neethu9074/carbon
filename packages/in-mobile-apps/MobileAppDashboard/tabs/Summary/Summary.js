import React, { Fragment } from 'react';

import HttpRequestOriginTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/HttpRequestOriginTopList';
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/ViewsTopList';
import { getLinkToAnalyze, summaryTab } from 'in-mobile-apps/navigation/paths';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-mobile-apps/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import Card from 'in-new-components/Card';

export default function Summary({ tagFilters, timeConfig, mobileAppId, mobileAppLabel, viewId }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col xs>
          <MobileAppMetricsKpiCard
            title={'Session Starts'}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'sessionStart',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  mobileAppLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'mobileBeacon.view.name'
                },
                showGraph: true
              })
            }}
          />
        </Col>
        <Col xs>
          <MobileAppMetricsKpiCard
            title={'View Transitions'}
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
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'viewChange',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  mobileAppLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'mobileBeacon.view.name'
                },
                showGraph: true
              })
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <MobileAppChartWrapper
            cardTitle="Activity"
            timeConfig={timeConfig}
            viewInAnalytics={{
              mobileAppLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Session Starts', 'View Transitions'],
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
          />
        </Col>
      </Row>

      <Row>
        <Col lg={viewId == null ? 4 : 6}>
          <Card title="Geography" withoutPadding>
            <MobileAppGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <HttpRequestOriginTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            mobileAppId={mobileAppId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'originsTab' }}
          />
        </Col>
        {viewId == null && (
          <Col lg={4}>
            <ViewsTopList tagFilters={tagFilters} timeConfig={timeConfig} mobileAppId={mobileAppId} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
