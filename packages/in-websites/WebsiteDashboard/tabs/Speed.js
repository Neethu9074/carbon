/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import AggregationSelectorWithUrlState from 'in-components/AggregationSelectorWithUrlState';
import { clsFormatter } from 'in-websites/analyze/AnalyzeView/metrics';
import { number, millis } from 'in-services/formatters/number';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { speedTab } from 'in-websites/navigation/paths';
import { Row, Col } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Speed({ timeConfig, tagFilters, websiteLabel, websiteId }) {
  const granularity = getChartGranularity(timeConfig);

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitlePageLoadsVSOnLoadTime')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.speedLabelPageLoads')],
              metricIds: ['pageLoads']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.speedLabelOnLoadTime')],
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
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitleOnLoadTime')}
            timeConfig={timeConfig}
            shareMaxAxisDomain
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: [
                t('in-websites:websiteDashboard.tabs.speedLabel50th'),
                t('in-websites:websiteDashboard.tabs.speedLabel90th'),
                t('in-websites:websiteDashboard.tabs.speedLabel95th'),
                t('in-websites:websiteDashboard.tabs.speedLabel99th'),
                t('in-websites:websiteDashboard.tabs.speedLabelMax')
              ],
              defaultDisabledMetrics: ['onLoadTimeMax'],
              metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th', 'onLoadTimeMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.speedLabelMean')],
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
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                },
                onLoadTime90th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P90',
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                },
                onLoadTime95th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P95',
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                },
                onLoadTime99th: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'P99',
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                },
                onLoadTimeMax: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MAX',
                  analyzeMetricName: 'onLoadTime',
                  beaconType: 'pageLoad'
                },
                onLoadTimeMean: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN',
                  analyzeMetricName: 'onLoadTime',
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
                cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitleNavigationTiming')}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                customHeight={300}
                shareMaxAxisDomain
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.stackedBar,
                  formatter: millis.forcedFixedCompact,
                  labels: [
                    t('in-websites:websiteDashboard.tabs.speedLabelUnload'),
                    t('in-websites:websiteDashboard.tabs.speedLabelRedirect'),
                    t('in-websites:websiteDashboard.tabs.speedLabelAppCache'),
                    t('in-websites:websiteDashboard.tabs.speedLabelDNS'),
                    t('in-websites:websiteDashboard.tabs.speedLabelTCP'),
                    t('in-websites:websiteDashboard.tabs.speedLabelSSL'),
                    t('in-websites:websiteDashboard.tabs.speedLabelRequest'),
                    t('in-websites:websiteDashboard.tabs.speedLabelResponse'),
                    t('in-websites:websiteDashboard.tabs.speedLabelDOM'),
                    t('in-websites:websiteDashboard.tabs.speedLabelChildren')
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
                  labels: [t('in-websites:websiteDashboard.tabs.speedLabelTimeToFirstByte')],
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
                cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitlePaintTiming')}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: [
                    t('in-websites:websiteDashboard.tabs.speedLabelFirstPaint'),
                    t('in-websites:websiteDashboard.tabs.speedLabelFirstContentfulPaint'),
                    t('in-websites:websiteDashboard.tabs.speedLabelLargestContentfulPaint')
                  ],
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
                cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitleFirstInputDelay')}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: [t('in-websites:websiteDashboard.tabs.speedLabelFirstInputDelay')],
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
                cardTitle={t('in-websites:websiteDashboard.tabs.speedCardTitleCumulativeLayoutShift')}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.line,
                  formatter: clsFormatter,
                  labels: [t('in-websites:websiteDashboard.tabs.speedLabelCumulativeLayoutShift')],
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
