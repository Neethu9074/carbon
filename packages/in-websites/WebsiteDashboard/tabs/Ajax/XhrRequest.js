/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { Button } from '@instana/components';
import { just } from '@instana/observables';

import { ajaxTabFullyQualified, detailsPath, useLinkToAnalyze, useLinkToWebsite } from 'in-websites/navigation/paths';
import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import GraphqlOperationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/GraphqlOperationsTopList';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import AggregationSelectorWithUrlState from 'in-components/AggregationSelectorWithUrlState';
import ErrorTypesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/ErrorTypesTopList';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/LocationsTopList';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { cacheTypes } from 'in-websites/WebsiteDashboard/tabs/Resources/Resource';
import { bytes, millis, number, percentage } from 'in-services/formatters/number';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/PagesTopList';
import { xhrId as xhrIdMatrixParameter } from 'in-websites/navigation/matrix';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { chartColors, carbonAlert } from 'in-themes/chartColors';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import BackButton from 'in-components/BackButton';
import Footer from 'in-components/Footer';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './XhrRequest.mless';

export default connectTo(({ location, tagFilters, timeConfig }) => {
  const observables = {};

  const xhrId = getMatrixParameter(location, '/details', xhrIdMatrixParameter);
  observables.xhrId = just(xhrId);

  if (xhrId) {
    observables.result = getWebsiteMetrics({
      tagFilters: tagFilters
        .concat({ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' })
        .concat({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'httpRequest' }),
      timeConfig,
      metrics: {
        requestTime: {
          metric: 'requestTime',
          aggregation: 'MEAN'
        }
      }
    });

    observables.graphqlCheckResult = getWebsiteMetrics({
      tagFilters: tagFilters
        .concat({ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' })
        .concat({ name: 'beacon.graphql.operationName', operator: 'NOT_EMPTY' }),
      timeConfig,
      metrics: {
        beaconCount: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      }
    });
  }

  return observables;
})(XhrRequestTab);

function XhrRequestTab({ websiteId, websiteLabel, pageId, tagFilters, timeConfig, xhrId, result, graphqlCheckResult }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');

  const analyzeHref = useLinkToAnalyze(
    tagCatalogHttpRequest && {
      beaconType: 'httpRequest',
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters: tagFilters.concat([{ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' }]),
        tagCatalog: tagCatalogHttpRequest
      }),
      groupBy: {
        groupbyTag: 'beacon.http.path'
      }
    }
  );

  const websiteHref = useLinkToWebsite(websiteId, { tabPath: '/ajax', pageId });

  if (!xhrId) {
    return <RedirectWithHash to={ajaxTabFullyQualified} />;
  }

  const tagFiltersForRequests = tagFilters.slice();
  tagFiltersForRequests.push({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });
  tagFiltersForRequests.push({ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' });

  let content;
  if (!result || result.progress.loading) {
    content = <DefaultLoadingDashboard />;
  } else if (result.errors && result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else {
    const granularity = getChartGranularity(timeConfig);
    const hasDetailedTimings = result.data && result.data['requestTime'] && result.data['requestTime'].length > 0.0;
    const graphqlBeacons = graphqlCheckResult?.data?.beaconCount?.[0]?.[1] || 0;
    const viewInAnalytics = {
      websiteLabel,
      group: {
        groupbyTag: 'beacon.http.path'
      }
    };

    const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId, pageId });

    content = (
      <Fragment>
        <Row>
          <Col xs={12}>
            <KpiCard title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestKpiCardTitleOrigin')} value={xhrId} />
          </Col>
        </Row>

        <Row>
          <Col lg={4}>
            <WebsiteChartWrapper
              title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleCalls')}
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.barOverlapping,
                formatter: number.compact,
                labels: [
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelCalls'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelErroneousCalls')
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleErroneousCallRate')}
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: percentage.detailed,
                labels: [t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelErroneousCallRate')],
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
              title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleLatency')}
              reverseTooltipOrder
              shareMaxAxisDomain
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.integral,
                calculateStackDifferences: true,
                formatter: millis.forcedFixedCompact,
                labels: [
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel50th'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel90th'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel95th'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel99th'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelMax')
                ],
                defaultDisabledMetrics: ['onLoadTimeMax'],
                metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th', 'onLoadTimeMax']
              }}
              y2={{
                renderer: Renderer.line,
                formatter: millis.forcedFixedCompact,
                labels: [t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelMean')],
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>

        {hasDetailedTimings && (
          <Row>
            <Col xs={12}>
              <AggregationSelectorWithUrlState
                defaultAggregation="MEAN"
                urlMatrixParamConfig={{ path: detailsPath, paramName: 'resourceTimingAgg' }}
              >
                {({ aggregation, aggregationSelector }) => (
                  <WebsiteChartWrapper
                    title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleResourceTiming')}
                    cardHeader={aggregationSelector}
                    customHeight={300}
                    timeConfig={timeConfig}
                    shareMaxAxisDomain
                    viewInAnalytics={viewInAnalytics}
                    y1={{
                      renderer: Renderer.stackedBar,
                      formatter: millis.forcedFixedCompact,
                      labels: [
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelRedirect'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelAppCache'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelDNS'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelTCP'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelSSL'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelRequest'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelResponse')
                      ],
                      metricIds: [
                        'redirectTime',
                        'appCacheTime',
                        'dnsTime',
                        'tcpTime',
                        'sslTime',
                        'requestTime',
                        'responseTime'
                      ]
                    }}
                    y2={{
                      renderer: Renderer.line,
                      formatter: millis.forcedFixedCompact,
                      labels: [t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelTimeToFirstByte')],
                      metricIds: ['ttfb'],
                      // Ensure high readability
                      colors: [themes.default.ids.color.option.neutral['900']]
                    }}
                    metricsConfiguration={{
                      timeConfig,
                      tagFilters: tagFiltersForRequests,
                      metrics: {
                        redirectTime: {
                          metric: 'redirectTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        appCacheTime: {
                          metric: 'appCacheTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        dnsTime: {
                          metric: 'dnsTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        tcpTime: {
                          metric: 'tcpTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        sslTime: {
                          metric: 'sslTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        requestTime: {
                          metric: 'requestTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        responseTime: {
                          metric: 'responseTime',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        ttfb: {
                          metric: 'ttfb',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        }
                      }
                    }}
                    renderPostChartContent={MarkerLanes}
                  />
                )}
              </AggregationSelectorWithUrlState>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={6}>
            <WebsiteChartWrapper
              title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleHTTPStatusCodeBreakdown')}
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.stackedArea,
                labels: [
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel1XX'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel2XX'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel3XX'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel4XX'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel5XX')
                ],
                formatter: number,
                tooltipFormatter: number.compact,
                fallbackMetricValue: 0,
                metricIds: ['http1xx', 'http2xx', 'http3xx', 'http4xx', 'http5xx'],
                colors: chartColors.fiveColorPalette
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>

          <Col lg={6}>
            <WebsiteChartWrapper
              title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleHTTPMethodBreakdown')}
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.stackedBar,
                formatter: number.forcedCompact,
                fallbackMetricValue: 0,
                colors: chartColors.fourColorPalette,
                labels: [
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelGET'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelPOST'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelPUT'),
                  t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelDELETE')
                ],
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>

        {hasDetailedTimings && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleCachingStatistics')}
                timeConfig={timeConfig}
                tagFilters={tagFiltersForRequests}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.cacheInteraction'
                }}
                metricIds={Object.keys(cacheTypes).sort()}
                metrics={[
                  {
                    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelCount'),
                    metric: 'beaconCount',
                    aggregation: 'SUM',
                    formatter: number.forcedCompact,
                    renderer: Renderer.stackedBar,
                    fallbackMetricValue: 0
                  }
                ]}
                translateLabel={label => cacheTypes[label] && cacheTypes[label].long}
                translateColor={label => cacheTypes[label] && cacheTypes[label].color}
                renderPostChartContent={MarkerLanes}
              />
            </Col>

            <Col lg={6}>
              <AggregationSelectorWithUrlState
                defaultAggregation="MEAN"
                urlMatrixParamConfig={{ path: detailsPath, paramName: 'resourceSizesAgg' }}
              >
                {({ aggregation, aggregationSelector }) => (
                  <WebsiteChartWrapper
                    title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleResourceSizes')}
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
                    viewInAnalytics={viewInAnalytics}
                    y1={{
                      renderer: Renderer.line,
                      formatter: bytes,
                      colors: chartColors.threeColorPalette,
                      labels: [
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelTransferSize'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelEncodedBodySize'),
                        t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelDecodedBodySize')
                      ],
                      metricIds: ['transferSize', 'encodedBodySize', 'decodedBodySize']
                    }}
                    metricsConfiguration={{
                      timeConfig,
                      tagFilters: tagFiltersForRequests,
                      metrics: {
                        transferSize: {
                          metric: 'transferSize',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        encodedBodySize: {
                          metric: 'encodedBodySize',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        },
                        decodedBodySize: {
                          metric: 'decodedBodySize',
                          granularity,
                          aggregation,
                          beaconType: 'httpRequest'
                        }
                      }
                    }}
                    renderPostChartContent={MarkerLanes}
                  />
                )}
              </AggregationSelectorWithUrlState>
            </Col>
          </Row>
        )}

        {graphqlBeacons > 0 && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestCardTitleGraphQLOperationTypes')}
                timeConfig={timeConfig}
                tagFilters={tagFiltersForRequests}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.graphql.operationType'
                }}
                metrics={[
                  {
                    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabelCount'),
                    metric: 'beaconCount',
                    aggregation: 'SUM',
                    formatter: number.forcedCompact,
                    renderer: Renderer.stackedBar,
                    fallbackMetricValue: 0
                  }
                ]}
                renderPostChartContent={MarkerLanes}
              />
            </Col>

            <Col lg={6}>
              <GraphqlOperationsTopList
                websiteId={websiteId}
                websiteLabel={websiteLabel}
                tagFilters={tagFiltersForRequests}
                timeConfig={timeConfig}
                urlMatrixParamConfig={{ path: detailsPath, paramTab: 'gqlOpsNamesTab' }}
                renderHistoricDataIndicator
              />
            </Col>
          </Row>
        )}

        <Row>
          {pageId == null && (
            <Col lg={4}>
              <PagesTopList
                websiteId={websiteId}
                websiteLabel={websiteLabel}
                tagFilters={tagFiltersForRequests}
                timeConfig={timeConfig}
                urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pagesTab' }}
                renderHistoricDataIndicator
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
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pathsTab' }}
              renderHistoricDataIndicator
            />
          </Col>
          <Col lg={pageId == null ? 4 : 6}>
            <ErrorTypesTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersForRequests}
              timeConfig={timeConfig}
              pageId={pageId}
              renderHistoricDataIndicator
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title title={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestTitle')} dynamic={xhrId} />

      <div className={locals.actions}>
        <BackButton
          label={t('in-websites:websiteDashboard.tabs.ajax.xhrRequestBackButton')}
          href={websiteHref}
          withoutMargin
        />

        <Button kind="secondary" href={analyzeHref}>
          {t('in-websites:websiteDashboard.tabs.ajax.xhrRequestButton')}
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
