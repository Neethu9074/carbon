import React, { Fragment } from 'react';
import theme from 'in-themes';

import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Deprecations from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecations';
import WebsiteGeoHeatMap from 'in-websites/WebsiteDashboard/components/WebsiteGeoHeatMap';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { number, millis, meanLatency, latency } from 'in-services/formatters/number';
import ErrorTopList from 'in-websites/WebsiteDashboard/tabs/Summary/ErrorTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import { getLinkToAnalyze, summaryTab } from 'in-websites/navigation/paths';
import AggregationSelector from 'in-new-components/AggregationSelector';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer';
import Card from 'in-new-components/Card';

export default function Summary({ websiteId, tagFilters, timeConfig, pageId, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId, pageId });

  return (
    <Fragment>
      <Row>
        <Col xs>
          <WebsiteMetricsKpiCard
            title="Page Loads"
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'pageLoad',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'beacon.location.path'
                },
                showGraph: true
              })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title="Page Transitions"
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                pageTransitions: {
                  metric: 'pageTransitions',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'pageChange',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'beacon.page.name'
                },
                showGraph: true
              })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title="onLoad Time (mean)"
            formatter={meanLatency.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                meanOnLoadTime: {
                  metric: 'onLoadTime',
                  aggregation: 'MEAN'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'pageLoad',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'beacon.location.path'
                },
                showGraph: true,
                metrics: [
                  {
                    metric: 'beaconDuration',
                    aggregation: 'MEAN'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P90'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P95'
                  }
                ],
                focusedMetric: 'beaconDuration',
                focusedMetricAggregation: 'MEAN'
              })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title="onLoad Time (90th)"
            formatter={latency.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                p90OnLoadTime: {
                  metric: 'onLoadTime',
                  aggregation: 'P90'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'pageLoad',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'beacon.location.path'
                },
                showGraph: true,
                metrics: [
                  {
                    metric: 'beaconDuration',
                    aggregation: 'MEAN'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P90'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P95'
                  }
                ],
                focusedMetric: 'beaconDuration',
                focusedMetricAggregation: 'P90'
              })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title="onLoad Time (95th)"
            formatter={latency.detailed}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                p05OnLoadTime: {
                  metric: 'onLoadTime',
                  aggregation: 'P95'
                }
              }
            }}
            iconAction={{
              text: 'View in Analyze',
              kind: 'subtle',
              icon: 'lib_analyze',
              href$: getLinkToAnalyze({
                beaconType: 'pageLoad',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters
                }),
                group: {
                  groupbyTag: 'beacon.location.path'
                },
                showGraph: true,
                metrics: [
                  {
                    metric: 'beaconDuration',
                    aggregation: 'MEAN'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P90'
                  },
                  {
                    metric: 'beaconDuration',
                    aggregation: 'P95'
                  }
                ],
                focusedMetric: 'beaconDuration',
                focusedMetricAggregation: 'P95'
              })
            }}
          />
        </Col>
      </Row>

      <Deprecations tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} websiteLabel={websiteLabel} />

      <Row>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="Page Views"
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Page Loads', 'Page Transitions'],
              metricIds: ['pageLoads', 'pageTransitions']
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
                pageTransitions: {
                  metric: 'pageTransitions',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="JS Errors"
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['JS Errors'],
              metricIds: ['errors'],
              colors: [theme.lib.colors.failure]
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                errors: {
                  metric: 'errors',
                  granularity,
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'error'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={4}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="onLoad Time"
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: ['onLoad Time'],
                  metricIds: ['onLoadTime']
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters,
                  metrics: {
                    onLoadTime: {
                      metric: 'onLoadTime',
                      granularity,
                      aggregation,
                      analyzeMetricName: 'beaconDuration',
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelector>
        </Col>
      </Row>

      <Row>
        <Col lg={pageId == null ? 4 : 6}>
          <Card title="Geography" withoutPadding>
            <WebsiteGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <ErrorTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            websiteId={websiteId}
            pageId={pageId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'jsErrorsTab' }}
          />
        </Col>
        {pageId == null && (
          <Col lg={4}>
            <PagesTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              websiteId={websiteId}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'pagesTab' }}
            />
          </Col>
        )}
      </Row>
      <Footer />
    </Fragment>
  );
}
