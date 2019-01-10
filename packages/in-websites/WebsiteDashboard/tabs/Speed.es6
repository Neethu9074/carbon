import React, { Fragment } from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import AggregationSelector from 'in-new-components/AggregationSelector';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Speed({ timeConfig, tagFilters }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Page Views vs. onLoad Time"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['Page Views'],
              metricIds: ['pageLoads']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: ['onLoad Time'],
              metricIds: ['onLoadTime'],
              // opposite color on the color wheel for max contrast
              colors: ['#e65c17']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  granularity,
                  aggregation: 'SUM'
                },
                onLoadTime: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="onLoad Time"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: ['50th', '90th', '95th', '99th'],
              metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                onLoadTime50th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P50'
                },
                onLoadTime90th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P90'
                },
                onLoadTime95th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P95'
                },
                onLoadTime99th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P99'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Navigation Timing"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                y1={{
                  renderer: Renderer.stackedBar,
                  formatter: millis.forcedFixedCompact,
                  labels: [
                    'Unload',
                    'Redirect',
                    'AppCache',
                    'DNS',
                    'TCP',
                    'SSL',
                    'Request',
                    'Response',
                    'DOM',
                    'Children'
                  ],
                  metricIds: [
                    'unloadTime',
                    'redirectTime',
                    'appCacheTime',
                    'dnsTime',
                    'tcpTime',
                    'sslTime',
                    'requestTime',
                    'responseTime',
                    'domTime',
                    'childrenTime'
                  ]
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters: tagFilters.concat({
                    name: 'beacon.type',
                    operator: 'EQUALS',
                    stringValue: 'pageLoad'
                  }),
                  metrics: {
                    unloadTime: {
                      metric: 'unloadTime',
                      granularity,
                      aggregation
                    },
                    redirectTime: {
                      metric: 'redirectTime',
                      granularity,
                      aggregation
                    },
                    appCacheTime: {
                      metric: 'appCacheTime',
                      granularity,
                      aggregation
                    },
                    dnsTime: {
                      metric: 'dnsTime',
                      granularity,
                      aggregation
                    },
                    tcpTime: {
                      metric: 'tcpTime',
                      granularity,
                      aggregation
                    },
                    sslTime: {
                      metric: 'sslTime',
                      granularity,
                      aggregation
                    },
                    requestTime: {
                      metric: 'requestTime',
                      granularity,
                      aggregation
                    },
                    responseTime: {
                      metric: 'responseTime',
                      granularity,
                      aggregation
                    },
                    domTime: {
                      metric: 'domTime',
                      granularity,
                      aggregation
                    },
                    childrenTime: {
                      metric: 'childrenTime',
                      granularity,
                      aggregation
                    }
                  }
                }}
              />
            )}
          </AggregationSelector>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Paint Timing"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                y1={{
                  calculateStackDifferences: true,
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: ['First Paint', 'First-Contentful Paint'],
                  metricIds: ['firstPaintTime', 'firstContentfulPaintTime']
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters,
                  metrics: {
                    firstPaintTime: {
                      metric: 'firstPaintTime',
                      granularity,
                      aggregation
                    },
                    firstContentfulPaintTime: {
                      metric: 'firstContentfulPaintTime',
                      granularity,
                      aggregation
                    }
                  }
                }}
              />
            )}
          </AggregationSelector>
        </Col>
      </Row>
    </Fragment>
  );
}
