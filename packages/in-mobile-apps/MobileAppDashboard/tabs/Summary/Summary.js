import React, { Fragment } from 'react';

import HttpRequestOriginTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/HttpRequestOriginTopList';
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/ViewsTopList';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-mobile-apps/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import Card from 'in-new-components/Card';

export default function Summary({ tagFilters, timeConfig, mobileAppId, viewId }) {
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
          />
        </Col>
        <Col xs>
          <MobileAppMetricsKpiCard
            title={'View Changes'}
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
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <MobileAppChartWrapper
            cardTitle="Activity"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Session Starts', 'View Changes'],
              metricIds: ['sessions', 'views']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  granularity,
                  aggregation: 'SUM'
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
          <HttpRequestOriginTopList tagFilters={tagFilters} timeConfig={timeConfig} mobileAppId={mobileAppId} />
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
