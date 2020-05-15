import React, { Fragment } from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { number, millis, fourDecimalPlaces } from 'in-services/formatters/number';
import AggregationSelector from 'in-new-components/AggregationSelector';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer';
import theme from 'in-themes';

const clsFormatter = {
  compact: fourDecimalPlaces,
  detailed: fourDecimalPlaces
};

export default function Speed({ timeConfig, tagFilters }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Page Loads vs. onLoad Time"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['Page Loads'],
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
            shareMaxAxisDomain
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: ['50th', '90th', '95th', '99th', 'Max'],
              defaultDisabledMetrics: ['onLoadTimeMax'],
              metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th', 'onLoadTimeMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: ['Mean'],
              defaultDisabledMetrics: ['onLoadTimeMean'],
              metricIds: ['onLoadTimeMean']
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
                },
                onLoadTimeMax: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MAX'
                },
                onLoadTimeMean: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN'
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
                shareMaxAxisDomain
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
                y2={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: ['Time to First Byte'],
                  metricIds: ['ttfb'],
                  // Ensure high readability
                  colors: [theme.lib.colors.N900Primary]
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
                    },
                    ttfb: {
                      metric: 'ttfb',
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
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: ['First Paint', 'First-Contentful Paint', 'Largest-Contentful Paint'],
                  metricIds: ['firstPaintTime', 'firstContentfulPaintTime', 'largestContentfulPaintTime']
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
                    },
                    largestContentfulPaintTime: {
                      metric: 'largestContentfulPaintTime',
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
        <Col lg={6}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="First Input Delay"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                y1={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: ['First Input Delay'],
                  metricIds: ['firstInputDelay']
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters,
                  metrics: {
                    firstInputDelay: {
                      metric: 'firstInputDelay',
                      granularity,
                      aggregation
                    }
                  }
                }}
              />
            )}
          </AggregationSelector>
        </Col>

        <Col lg={6}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Cumulative Layout Shift"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                y1={{
                  renderer: Renderer.line,
                  formatter: clsFormatter,
                  labels: ['Cumulative Layout Shift'],
                  metricIds: ['cumulativeLayoutShift']
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters,
                  metrics: {
                    cumulativeLayoutShift: {
                      metric: 'cumulativeLayoutShift',
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

      <Footer />
    </Fragment>
  );
}
