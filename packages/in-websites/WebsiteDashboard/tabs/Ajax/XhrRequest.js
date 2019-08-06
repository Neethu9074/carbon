import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import { getLinkToWebsite, ajaxTabFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ErrorTypesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/ErrorTypesTopList';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/LocationsTopList';
import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import { cacheTypes } from 'in-websites/WebsiteDashboard/tabs/Resources/Resource';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Ajax/PagesTopList';
import { xhrId as xhrIdMatrixParameter } from 'in-websites/navigation/matrix';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import AggregationSelector from 'in-new-components/AggregationSelector';
import { millis, number, bytes } from 'in-services/formatters/number';
import AjaxBreadcrumb from 'in-websites/breadcrumbs/AjaxBreadcrumb';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
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
  }

  return observables;
})(XhrRequestTab);

function XhrRequestTab({ websiteId, websiteLabel, pageId, tagFilters, timeConfig, xhrId, result }) {
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

    content = (
      <Fragment>
        <Row>
          <Col xs={12}>
            <KpiCard title="Origin" value={xhrId} />
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
              shareMaxAxisDomain
              timeConfig={timeConfig}
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
                  },
                  onLoadTimeMax: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'MAX'
                  },
                  onLoadTimeMean: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'MEAN'
                  }
                }
              }}
            />
          </Col>
        </Row>

        {hasDetailedTimings && (
          <Row>
            <Col xs={12}>
              <AggregationSelector defaultAggregation="MEAN">
                {({ aggregation, aggregationSelector }) => (
                  <WebsiteChartWrapper
                    cardTitle="Resource Timing"
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
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
                    metricsConfiguration={{
                      timeConfig,
                      tagFilters,
                      metrics: {
                        redirectTime: {
                          metric: 'redirectTime',
                          granularity,
                          aggregation
                        },
                        appCacheTime: {
                          metric: 'appCacheTime',
                          granularity,
                          aggregation
                        },
                        dnsTime: {
                          metric: 'dnsTime',
                          granularity,
                          aggregation
                        },
                        tcpTime: {
                          metric: 'tcpTime',
                          granularity,
                          aggregation
                        },
                        sslTime: {
                          metric: 'sslTime',
                          granularity,
                          aggregation
                        },
                        requestTime: {
                          metric: 'requestTime',
                          granularity,
                          aggregation
                        },
                        responseTime: {
                          metric: 'responseTime',
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
        )}

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

        {hasDetailedTimings && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                cardTitle="Caching Statistics"
                timeConfig={timeConfig}
                tagFilters={tagFilters}
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
              />
            </Col>

            <Col lg={6}>
              <AggregationSelector defaultAggregation="MEAN">
                {({ aggregation, aggregationSelector }) => (
                  <WebsiteChartWrapper
                    cardTitle="Resource Sizes"
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
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
                          aggregation
                        },
                        encodedBodySize: {
                          metric: 'encodedBodySize',
                          granularity,
                          aggregation
                        },
                        decodedBodySize: {
                          metric: 'decodedBodySize',
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
        )}

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
  }

  return (
    <Fragment>
      <Breadcrumbs items={[<AjaxBreadcrumb xhrId={xhrId} />]} />
      <Title title="HTTP Request Details" dynamic={xhrId} />

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
    </Fragment>
  );
}
