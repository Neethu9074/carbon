/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React, { Fragment } from 'react';

import { getLinkToWebsite, ajaxTabFullyQualified, getLinkToAnalyze, detailsPath } from 'in-websites/navigation/paths';
import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import GraphqlOperationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/GraphqlOperationsTopList';
import AggregationSelectorWithUrlState from 'in-new-components/AggregationSelectorWithUrlState';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ErrorTypesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/ErrorTypesTopList';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/LocationsTopList';
import { cacheTypes } from 'in-websites/WebsiteDashboard/tabs/Resources/Resource';
import { millis, number, bytes, percentage } from 'in-services/formatters/number';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/PagesTopList';
import { xhrId as xhrIdMatrixParameter } from 'in-websites/navigation/matrix';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Footer from 'in-new-components/Footer';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import theme from 'in-themes';

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
            <KpiCard title="Origin" value={xhrId} />
          </Col>
        </Row>

        <Row>
          <Col lg={4}>
            <WebsiteChartWrapper
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
          <Col lg={4}>
            <WebsiteChartWrapper
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
                    cardTitle="Resource Timing"
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
                    shareMaxAxisDomain
                    viewInAnalytics={viewInAnalytics}
                    y1={{
                      renderer: Renderer.stackedBar,
                      formatter: millis.forcedFixedCompact,
                      labels: ['Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response'],
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
                      labels: ['Time to First Byte'],
                      metricIds: ['ttfb'],
                      // Ensure high readability
                      colors: [theme.lib.colors.N900Primary]
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
              cardTitle="HTTP Status Code Breakdown"
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>

        {hasDetailedTimings && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                cardTitle="Caching Statistics"
                timeConfig={timeConfig}
                tagFilters={tagFiltersForRequests}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.cacheInteraction'
                }}
                metricIds={Object.keys(cacheTypes).sort()}
                metrics={[
                  {
                    label: 'Count',
                    metric: 'beaconCount',
                    aggregation: 'SUM',
                    formatter: number.forcedCompact,
                    renderer: Renderer.stackedBar,
                    fallbackMetricValue: 0
                  }
                ]}
                translateLabel={label => cacheTypes[label] && cacheTypes[label].long}
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
                    cardTitle="Resource Sizes"
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
                    viewInAnalytics={viewInAnalytics}
                    y1={{
                      renderer: Renderer.line,
                      formatter: bytes,
                      labels: ['Transfer Size', 'Encoded Body Size', 'Decoded Body Size'],
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
                cardTitle="GraphQL Operation Types"
                timeConfig={timeConfig}
                tagFilters={tagFiltersForRequests}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.graphql.operationType'
                }}
                metrics={[
                  {
                    label: 'Count',
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
  }

  return (
    <Fragment>
      <Title title="Website HTTP Request Details" dynamic={xhrId} />

      <div className={locals.actions}>
        <BackButton
          label="Back to list of HTTP request origins"
          href$={getLinkToWebsite(websiteId, { tabPath: '/ajax', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={getLinkToAnalyze({
            beaconType: 'httpRequest',
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              websiteLabel,
              tagFilters: tagFilters.concat([{ name: 'beacon.http.origin', stringValue: xhrId, operator: 'EQUALS' }])
            }),
            group: {
              groupbyTag: 'beacon.http.path'
            }
          })}
        >
          Analyze HTTP Request Origin
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
