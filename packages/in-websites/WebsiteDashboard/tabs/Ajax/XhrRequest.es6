import React, { Fragment } from 'react';

import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import ErrorTypesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/ErrorTypesTopList';
import { getLinkToWebsite, ajaxTabFullyQualified } from 'in-websites/navigation/paths';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/LocationsTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/PagesTopList';
import { xhrId as xhrIdMatrixParameter } from 'in-websites/navigation/matrix';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { millis, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Title from 'in-components/Title';
import theme from 'in-themes';

export default function ResourceTab({ location, websiteId, websiteLabel, pageId, tagFilters, timeConfig }) {
  const xhrId = getMatrixParameter(location, '/details', xhrIdMatrixParameter);
  if (!xhrId) {
    return <RedirectWithHash to={ajaxTabFullyQualified} />;
  }

  const tagFiltersForRequests = tagFilters.slice();
  tagFiltersForRequests.push({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });
  tagFiltersForRequests.push({ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' });

  const granularity = getChartGranularity(timeConfig);

  const content = (
    <Fragment>
      <Row>
        <Col xs={12}>
          <KpiCard title="Target" value={xhrId} />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <WebsiteBeaconGroupsChartWrapper
            cardTitle="Calls"
            timeConfig={timeConfig}
            tagFilters={tagFiltersForRequests}
            group={{
              groupbyTag: 'beacon.erroneous'
            }}
            metricIds={['false', 'true']}
            metrics={[
              {
                label: 'Resource Loads',
                metric: 'beaconCount',
                aggregation: 'SUM',
                formatter: number.forcedCompact,
                renderer: Renderer.stackedBar,
                fallbackMetricValue: 0
              }
            ]}
            translateLabel={label => (!label ? 'Success' : 'Failure')}
            translateColor={label => (!label ? theme.lib.colors.success : theme.lib.colors.failure)}
            // colors: [theme.lib.colors.failure]
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Latency"
            reverseTooltipOrder
            timeConfig={timeConfig}
            y1={{
              calculateStackDifferences: true,
              renderer: Renderer.stackedBar,
              formatter: millis.forcedFixedCompact,
              labels: ['50th', '90th', '95th', '99th'],
              metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                onLoadTime50th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P50'
                },
                onLoadTime90th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P90'
                },
                onLoadTime95th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P95'
                },
                onLoadTime99th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P99'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <WebsiteChartWrapper
            cardTitle="HTTP Status Code Breakdown"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedArea,
              labels: ['1XX', '2XX', '3XX', '4XX', '5XX'],
              formatter: number,
              tooltipFormatter: number.compact,
              fallbackMetricValue: 0,
              metricIds: ['http1xx', 'http2xx', 'http3xx', 'http4xx', 'http5xx'],
              colors: [
                theme.lib.colors.chart.strokeColors25[0],
                theme.lib.colors.chart.strokeColors25[1],
                theme.lib.colors.chart.strokeColors25[4],
                theme.lib.colors.chart.strokeColors25[2],
                theme.lib.colors.chart.strokeColors25[6]
              ]
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                http1xx: {
                  metric: 'http1xx',
                  granularity,
                  aggregation: 'SUM'
                },
                http2xx: {
                  metric: 'http2xx',
                  granularity,
                  aggregation: 'SUM'
                },
                http3xx: {
                  metric: 'http3xx',
                  granularity,
                  aggregation: 'SUM'
                },
                http4xx: {
                  metric: 'http4xx',
                  granularity,
                  aggregation: 'SUM'
                },
                http5xx: {
                  metric: 'http5xx',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>

        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="HTTP Method Breakdown"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              fallbackMetricValue: 0,
              labels: ['GET', 'POST', 'PUT', 'DELETE'],
              metricIds: ['httpGet', 'httpPost', 'httpPut', 'httpDelete']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                httpGet: {
                  metric: 'httpGet',
                  granularity,
                  aggregation: 'SUM'
                },
                httpPost: {
                  metric: 'httpPost',
                  granularity,
                  aggregation: 'SUM'
                },
                httpPut: {
                  metric: 'httpPut',
                  granularity,
                  aggregation: 'SUM'
                },
                httpDelete: {
                  metric: 'httpDelete',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        {pageId == null && (
          <Col lg={4}>
            <PagesTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersForRequests}
              timeConfig={timeConfig}
            />
          </Col>
        )}
        <Col lg={pageId == null ? 4 : 6}>
          <LocationsTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            pageId={pageId}
          />
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <ErrorTypesTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            pageId={pageId}
          />
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Fragment>
      <Breadcrumbs items={[<Breadcrumb label="AJAX Details">{xhrId}</Breadcrumb>]} />
      <Title title="AJAX Details" dynamic={xhrId} />
      <BackButton
        label="Back to list of AJAX requests"
        href$={getLinkToWebsite(websiteId, { tabPath: '/ajax', pageId })}
      />
      {content}
    </Fragment>
  );
}
