import React, { Fragment } from 'react';

import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import { number, millis } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({ tagFilters, timeConfig }) {
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="Page Loads"
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                calls: {
                  metric: 'pageLoads',
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="onLoad Time (mean)"
            formatter={millis.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                errors: {
                  metric: 'onLoadTime',
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="onLoad Time (90th)"
            formatter={millis.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                errors: {
                  metric: 'onLoadTime',
                  aggregation: 'P90'
                }
              }
            }}
          />
        </Col>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="onLoad Time (95th)"
            formatter={millis.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                errors: {
                  metric: 'onLoadTime',
                  aggregation: 'P95'
                }
              }
            }}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
