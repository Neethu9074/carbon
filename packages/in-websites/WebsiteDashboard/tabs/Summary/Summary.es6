import React, { Fragment } from 'react';

import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Deprecations from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecations';
import WebsiteGeoHeatMap from 'in-websites/WebsiteDashboard/components/WebsiteGeoHeatMap';
import { number, millis, meanLatency, latency } from 'in-services/formatters/number';
import ErrorTopList from 'in-websites/WebsiteDashboard/tabs/Summary/ErrorTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import AggregationSelector from 'in-new-components/AggregationSelector';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

export default function Summary({ websiteId, tagFilters, timeConfig, pageId, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title={'Page Views'}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                pageLoads: {
                  metric: 'pageViews',
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={3}>
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
          />
        </Col>
        <Col lg={3}>
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
          />
        </Col>
        <Col lg={3}>
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
          />
        </Col>
      </Row>

      <Deprecations tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} websiteLabel={websiteLabel} />

      <Row>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="Page Views"
            timeConfig={timeConfig}
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
                  aggregation: 'SUM'
                },
                pageTransitions: {
                  metric: 'pageTransitions',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="JS Errors"
            renderLegend={false}
            timeConfig={timeConfig}
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
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <AggregationSelector defaultAggregation="MEAN">
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle="onLoad Time"
                renderLegend={false}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
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
        <Col lg={pageId == null ? 4 : 6}>
          <Card title="Geography" withoutPadding>
            <WebsiteGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <ErrorTopList tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} pageId={pageId} />
        </Col>
        {pageId == null && (
          <Col lg={4}>
            <PagesTopList tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
