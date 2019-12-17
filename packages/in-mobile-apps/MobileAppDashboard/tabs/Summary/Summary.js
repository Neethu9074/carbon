import React, { Fragment } from 'react';

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
            title={'Sessions'}
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
      </Row>

      <Row>
        <Col lg={12}>
          <MobileAppChartWrapper
            cardTitle="Sessions"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Sessions'],
              metricIds: ['sessions']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={viewId == null ? 6 : 12}>
          <Card title="Geography" withoutPadding>
            <MobileAppGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        {viewId == null && (
          <Col lg={6}>
            <ViewsTopList tagFilters={tagFilters} timeConfig={timeConfig} mobileAppId={mobileAppId} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
