import React, { Fragment } from 'react';

import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Deprecations from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecations';
import ErrorTopList from 'in-websites/WebsiteDashboard/tabs/Summary/ErrorTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import WorldMapCard from 'in-websites/WorldMapCard/WorldMapCard';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import theme from 'in-themes';

export default function Summary({ websiteId, tagFilters, timeConfig, pageId }) {
  const granularity = getChartGranularity(timeConfig);

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
                pageLoads: {
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
            formatter={millis.detailed}
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
            formatter={millis.detailed}
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

      <Deprecations tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} />

      <Row>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="Page Loads"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['Page Loads'],
              metricIds: ['pageLoads']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle="Errors"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['Errors'],
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
          <WebsiteChartWrapper
            cardTitle="onLoad Time"
            timeConfig={timeConfig}
            y1={{
              calculateStackDifferences: true,
              renderer: Renderer.line,
              formatter: millis.fixed,
              labels: ['avg', '50th', '90th', '95th', '99th'],
              metricIds: ['onLoadTimeAvg', 'onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                onLoadTimeAvg: {
                  metric: 'onLoadTime',
                  granularity,
                  aggregation: 'MEAN'
                },
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
        <Col lg={pageId == null ? 4 : 6}>
          <WorldMapCard title="Geography" height={300} tagFilters={tagFilters} timeConfig={timeConfig} />
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
