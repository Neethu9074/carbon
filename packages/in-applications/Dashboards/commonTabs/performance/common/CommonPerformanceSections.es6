import React, { Fragment } from 'react';

import heatmapExample from 'in-applications/Dashboards/commonTabs/performance/common/heatmap.png';
import { newApplicationMonitoringFeaturePlaceholdersEnabled } from 'in-services/featureFlags';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function CommonPerformanceSection({ applicationId, serviceId, endpointId, timeframe }) {
  const granularity = getChartGranularity(timeframe);
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card title="Latency">
            <ChartWrapper
              timeframe={timeframe}
              y1={{
                renderer: Renderer.integral,
                labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
                metricIds: [
                  'durationMin',
                  'duration25th',
                  'duration50th',
                  'duration75th',
                  'duration95th',
                  'duration98th',
                  'duration99th',
                  'durationMax'
                ]
              }}
              metricsConfiguration={{
                filter: {
                  timeframe,
                  application: applicationId,
                  service: serviceId,
                  endpointId
                },
                metrics: {
                  durationMin: {
                    metric: 'duration.min',
                    granularity,
                    aggregation: 'MIN'
                  },
                  duration25th: {
                    metric: 'duration.25th',
                    granularity,
                    aggregation: 'P25'
                  },
                  duration50th: {
                    metric: 'duration.25th',
                    granularity,
                    aggregation: 'P25'
                  },
                  duration75th: {
                    metric: 'duration.25th',
                    granularity,
                    aggregation: 'P25'
                  },
                  duration95th: {
                    metric: 'duration.25th',
                    granularity,
                    aggregation: 'P25'
                  },
                  duration98th: {
                    metric: 'duration.98th',
                    granularity,
                    aggregation: 'P98'
                  },
                  duration99th: {
                    metric: 'duration.99th',
                    granularity,
                    aggregation: 'P99'
                  },
                  durationMax: {
                    metric: 'duration.max',
                    granularity,
                    aggregation: 'MAX'
                  }
                }
              }}
            />
          </Card>
        </Col>
      </Row>

      {newApplicationMonitoringFeaturePlaceholdersEnabled && (
        <Row>
          <Col lg={12}>
            <Card title="Latency Heatmap">
              <img src={heatmapExample} alt="Example heat map" />
            </Card>
          </Col>
        </Row>
      )}
    </Fragment>
  );
}
