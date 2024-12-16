/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TimeConfig, TagFilter } from '@instana/types';
import { Button } from '@instana/components';
import { just } from '@instana/observables';

// @ts-expect-error Could not find a declaration file for module
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
// @ts-expect-error Could not find a declaration file for module
import { httpRequestId as httpRequestIdMatrixParameter } from 'in-mobile-apps/navigation/matrix';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import { httpRequestsTabFullyQualified } from 'in-mobile-apps/navigation/paths';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
// @ts-expect-error Could not find a declaration file for module
import RedirectWithHash from 'in-components/RedirectWithHash';
// @ts-expect-error Could not find a declaration file for module
import connectTo from 'in-hoc/connectTo';
import { detailsPath, useGetLinkToMobileApp, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import ErrorTypesTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/ErrorTypesTopList';
import LocationsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/LocationsTopList';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests/ViewsTopList';
import { millis, number, percentage } from 'in-services/formatters/number';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { chartColors, carbonAlert } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import BackButton from 'in-components/BackButton';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './HttpRequest.mless';

interface HttpRequestProp {
  location: any;
}

export default connectTo(({ location }: HttpRequestProp) => {
  const observables: Record<string, any> = {};

  const httpRequestId = getMatrixParameter(location, '/details', httpRequestIdMatrixParameter);
  observables.httpRequestId = just(httpRequestId);

  return observables;
})(HttpRequestTab);

interface HttpRequestTabProp {
  httpRequestId: string;
  mobileAppId: string;
  mobileAppLabel: string;
  viewId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
}

function HttpRequestTab({
  mobileAppId,
  mobileAppLabel,
  viewId,
  tagFilters,
  timeConfig,
  httpRequestId
}: HttpRequestTabProp) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    tabPath: '/httpRequests',
    viewId
  });
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  if (!httpRequestId) {
    return <RedirectWithHash to={httpRequestsTabFullyQualified} />;
  }

  const tagFiltersForRequests = tagFilters.slice();
  tagFiltersForRequests.push({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'httpRequest',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });
  tagFiltersForRequests.push({
    name: 'mobileBeacon.http.origin',
    stringValue: httpRequestId,
    operator: 'EQUALS',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });
  const granularity = getChartGranularity(timeConfig);
  const viewInAnalytics = {
    mobileAppLabel,
    group: {
      groupbyTag: 'mobileBeacon.http.path'
    }
  };
  const MarkerLane = MobileAppMarkerLane({ mobileAppId });

  const content = (
    <Fragment>
      <Row>
        <Col xs={12}>
          <KpiCard title={t('in-mobile-apps:dashboard.tabs.originTitle')} value={httpRequestId} />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.callsCardTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.barOverlapping,
              formatter: number.compact,
              labels: [
                t('in-mobile-apps:dashboard.tabs.callsLabel'),
                t('in-mobile-apps:dashboard.tabs.erroneousCallsLabel')
              ],
              metricIds: ['calls', 'errors'],
              colors: [chartColors.strokeColors100[0], carbonAlert.red60]
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
        <Col lg={4}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.erroneousCallRateTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: percentage.detailed,
              labels: [t('in-mobile-apps:dashboard.tabs.erroneousCallRateLabel')],
              metricIds: ['errors'],
              colors: [carbonAlert.red60]
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
        <Col lg={4}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.latencyCardTitle')}
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: [
                t('in-mobile-apps:dashboard.tabs.50thLabel'),
                t('in-mobile-apps:dashboard.tabs.90thLabel'),
                t('in-mobile-apps:dashboard.tabs.95thLabel'),
                t('in-mobile-apps:dashboard.tabs.99thLabel'),
                t('in-mobile-apps:dashboard.tabs.maxLabel')
              ],
              defaultDisabledMetrics: ['onLoadTimeMax'],
              metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th', 'onLoadTimeMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-mobile-apps:dashboard.tabs.meanLabel')],
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.HTTPStatusCodeBreakdownTitle')}
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
                chartColors.strokeColors25[0],
                chartColors.strokeColors25[1],
                chartColors.strokeColors25[4],
                chartColors.strokeColors25[2],
                chartColors.strokeColors25[6]
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
            renderPostChartContent={MarkerLane}
          />
        </Col>

        <Col lg={6}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.HTTPMethodBreakdownTitle')}
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
            renderPostChartContent={MarkerLane}
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
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'viewsTab', paramMetric: 'beaconCount' }}
              renderHistoricDataIndicator
            />
          </Col>
        )}
        <Col lg={viewId == null ? 4 : 6}>
          <LocationsTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pathsTab', paramMetric: 'beaconCount' }}
            renderHistoricDataIndicator
          />
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <ErrorTypesTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFiltersForRequests}
            timeConfig={timeConfig}
            renderHistoricDataIndicator
          />
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Fragment>
      <Title title={t('in-mobile-apps:dashboard.tabs.MobileAppHTTPRequestDetailsTitle')} dynamic={httpRequestId} />

      <div className={locals.actions}>
        <BackButton
          label={t('in-mobile-apps:dashboard.tabs.BackToListOfHTTPRequestOriginsLabel')}
          href={linkToMobileAppHref}
          withoutMargin
        />

        <Button
          kind="secondary"
          href={
            tagCatalogHttpRequest &&
            getLinkToMobileAppAnalyze({
              beaconType: 'httpRequest',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters: tagFilters.concat([
                  {
                    name: 'mobileBeacon.http.origin',
                    stringValue: httpRequestId,
                    operator: 'EQUALS',
                    type: 'TAG_FILTER',
                    entity: 'NOT_APPLICABLE'
                  }
                ]),
                tagCatalog: tagCatalogHttpRequest
              }),
              groupBy: {
                groupbyTag: 'mobileBeacon.http.path'
              }
            })
          }
        >
          {t('in-mobile-apps:dashboard.tabs.AnalyzeHTTPRequestOriginBtn')}
        </Button>
      </div>

      {content}
    </Fragment>
  );
}
