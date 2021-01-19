/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React, { Fragment } from 'react';

import {
  getLinkToMobileApp,
  httpRequestsTabFullyQualified,
  getLinkToAnalyze,
  detailsPath
} from 'in-mobile-apps/navigation/paths';
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
import ErrorTypesTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/ErrorTypesTopList';
import LocationsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/LocationsTopList';
import { httpRequestId as httpRequestIdMatrixParameter } from 'in-mobile-apps/navigation/matrix';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/ViewsTopList';
import { millis, number, percentage } from 'in-services/formatters/number';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-mobile-apps/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import theme from 'in-themes';

import locals from './HttpRequest.mless';

export default connectTo(({ location }) => {
  const observables = {};

  const httpRequestId = getMatrixParameter(location, '/details', httpRequestIdMatrixParameter);
  observables.httpRequestId = just(httpRequestId);

  return observables;
})(HttpRequestTab);

function HttpRequestTab({ mobileAppId, mobileAppLabel, viewId, tagFilters, timeConfig, httpRequestId }) {
  if (!httpRequestId) {
    return <RedirectWithHash to={httpRequestsTabFullyQualified} />;
  }

  const tagFiltersForRequests = tagFilters.slice();
  tagFiltersForRequests.push({ name: 'mobileBeacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });
  tagFiltersForRequests.push({ name: 'mobileBeacon.http.origin', stringValue: httpRequestId, operator: 'EQUALS' });
  const granularity = getChartGranularity(timeConfig);
  const viewInAnalytics = {
    mobileAppLabel,
    group: {
      groupbyTag: 'mobileBeacon.http.path'
    }
  };

  const content = (
    <Fragment>
      <Row>
        <Col xs={12}>
          <KpiCard title="Origin" value={httpRequestId} />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <MobileAppChartWrapper
            cardTitle="Calls"
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.barOverlapping,
              formatter: number.compact,
              labels: ['Calls', 'Erroneous Calls'],
              metricIds: ['calls', 'errors'],
              colors: [theme.lib.colors.lightPrimary240, theme.lib.colors.failure]
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                calls: {
                  metric: 'beaconCount',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest',
                  omitMetricInAnalytics: true
                },
                errors: {
                  metric: 'beaconErrorCount',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <MobileAppChartWrapper
            cardTitle="Erroneous Call Rate"
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: percentage.detailed,
              labels: ['Erroneous Call Rate'],
              metricIds: ['errors'],
              colors: [theme.lib.colors.failure]
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                errors: {
                  metric: 'beaconErrorRate',
                  granularity,
                  aggregation: 'MEAN',
                  beaconType: 'httpRequest'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <MobileAppChartWrapper
            cardTitle="Latency"
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
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
              tagFilters: tagFiltersForRequests,
              metrics: {
                onLoadTime50th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P50',
                  beaconType: 'httpRequest'
                },
                onLoadTime90th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P90',
                  beaconType: 'httpRequest'
                },
                onLoadTime95th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P95',
                  beaconType: 'httpRequest'
                },
                onLoadTime99th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P99',
                  beaconType: 'httpRequest'
                },
                onLoadTimeMax: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MAX',
                  beaconType: 'httpRequest'
                },
                onLoadTimeMean: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MEAN',
                  beaconType: 'httpRequest'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <MobileAppChartWrapper
            cardTitle="HTTP Status Code Breakdown"
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.stackedBar,
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
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                http2xx: {
                  metric: 'http2xx',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                http3xx: {
                  metric: 'http3xx',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                http4xx: {
                  metric: 'http4xx',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                http5xx: {
                  metric: 'http5xx',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                }
              }
            }}
          />
        </Col>

        <Col lg={6}>
          <MobileAppChartWrapper
            cardTitle="HTTP Method Breakdown"
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
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
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                httpPost: {
                  metric: 'httpPost',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                httpPut: {
                  metric: 'httpPut',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                },
                httpDelete: {
                  metric: 'httpDelete',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'httpRequest'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        {viewId == null && (
          <Col lg={4}>
            <ViewsTopList
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              tagFilters={tagFiltersForRequests}
              timeConfig={timeConfig}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'viewsTab' }}
            />
          </Col>
        )}
        <Col lg={viewId == null ? 4 : 6}>
          <LocationsTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            viewId={viewId}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pathsTab' }}
          />
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <ErrorTypesTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            viewId={viewId}
          />
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Fragment>
      <Title title="Mobile App HTTP Request Details" dynamic={httpRequestId} />

      <div className={locals.actions}>
        <BackButton
          label="Back to list of HTTP request origins"
          href$={getLinkToMobileApp(mobileAppId, { tabPath: '/httpRequests', viewId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={getLinkToAnalyze({
            beaconType: 'httpRequest',
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              mobileAppLabel,
              tagFilters: tagFilters.concat([
                { name: 'mobileBeacon.http.origin', stringValue: httpRequestId, operator: 'EQUALS' }
              ])
            }),
            group: {
              groupbyTag: 'mobileBeacon.http.path'
            }
          })}
        >
          Analyze HTTP Request Origin
        </Button>
      </div>

      {content}
    </Fragment>
  );
}
