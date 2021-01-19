/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';

import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import AggregationSelectorWithUrlState from 'in-new-components/AggregationSelectorWithUrlState';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { clsFormatter } from 'in-websites/analyze/AnalyzeView/metrics';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { speedTab } from 'in-websites/navigation/paths';
import Footer from 'in-new-components/Footer';

export default function Speed({ timeConfig, tagFilters, websiteLabel, websiteId }) {
  const granularity = getChartGranularity(timeConfig);

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Page Loads vs. onLoad Time"
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
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
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'pageLoad'
                },
                onLoadTime: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="onLoad Time"
            timeConfig={timeConfig}
            shareMaxAxisDomain
            viewInAnalytics={{
              websiteLabel
            }}
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
                  aggregation: 'P50',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                },
                onLoadTime90th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P90',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                },
                onLoadTime95th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P95',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                },
                onLoadTime99th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P99',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                },
                onLoadTimeMax: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MAX',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                },
                onLoadTimeMean: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN',
                  analyzeMetricName: 'beaconDuration',
                  beaconType: 'pageLoad'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <AggregationSelectorWithUrlState
            defaultAggregation="MEAN"
            urlMatrixParamConfig={{ path: speedTab, paramName: 'navTimingAgg' }}
          >
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Navigation Timing"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                shareMaxAxisDomain
                viewInAnalytics={{
                  websiteLabel
                }}
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
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    redirectTime: {
                      metric: 'redirectTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    appCacheTime: {
                      metric: 'appCacheTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    dnsTime: {
                      metric: 'dnsTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    tcpTime: {
                      metric: 'tcpTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    sslTime: {
                      metric: 'sslTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    requestTime: {
                      metric: 'requestTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    responseTime: {
                      metric: 'responseTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    domTime: {
                      metric: 'domTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    childrenTime: {
                      metric: 'childrenTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    ttfb: {
                      metric: 'ttfb',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelectorWithUrlState>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <AggregationSelectorWithUrlState
            defaultAggregation="MEAN"
            urlMatrixParamConfig={{ path: speedTab, paramName: 'paintTimingAgg' }}
          >
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Paint Timing"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
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
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    firstContentfulPaintTime: {
                      metric: 'firstContentfulPaintTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    },
                    largestContentfulPaintTime: {
                      metric: 'largestContentfulPaintTime',
                      granularity,
                      aggregation,
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelectorWithUrlState>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <AggregationSelectorWithUrlState
            defaultAggregation="MEAN"
            urlMatrixParamConfig={{ path: speedTab, paramName: 'firstInputDelayAgg' }}
          >
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="First Input Delay"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
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
                      aggregation,
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelectorWithUrlState>
        </Col>

        <Col lg={6}>
          <AggregationSelectorWithUrlState
            defaultAggregation="MEAN"
            urlMatrixParamConfig={{ path: speedTab, paramName: 'cumLayoutShiftAgg' }}
          >
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="Cumulative Layout Shift"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
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
                      aggregation,
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelectorWithUrlState>
        </Col>
      </Row>

      <Footer />
    </Fragment>
  );
}
