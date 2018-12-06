import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import {
  getResourceTypes,
  types as resourceTypes
} from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import LimitedCapabilitiesCard from 'in-websites/WebsiteDashboard/components/LimitedCapabilitiesCard';
import ResourceTypesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/ResourceTypesTopList';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { getLinkToWebsite, resourcesTabFullyQualified } from 'in-websites/navigation/paths';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Resources/LocationsTopList';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { resourceId as resourceIdMatrixParameter } from 'in-websites/navigation/matrix';
import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/PagesTopList';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import AggregationSelector from 'in-new-components/AggregationSelector';
import { bytes, millis, number } from 'in-services/formatters/number';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

const cacheTypes = {
  fullLoad: {
    long: 'Full Load'
  },
  validated: {
    long: 'Validated'
  },
  cached: {
    long: 'Cached'
  },
  unknown: {
    long: 'Unknown'
  }
};

export default connectTo(({ location, tagFilters, timeConfig }) => {
  const observables = {};

  const resourceId = getMatrixParameter(location, '/details', resourceIdMatrixParameter);
  observables.resourceId = just(resourceId);

  if (resourceId) {
    observables.result = getWebsiteMetrics({
      tagFilters: tagFilters.concat({ name: 'beacon.http.origin', stringValue: resourceId, operator: 'EQUALS' }),
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
})(ResourceTab);

function ResourceTab({ resourceId, result, websiteId, websiteLabel, pageId, tagFilters, timeConfig }) {
  if (!resourceId) {
    return <RedirectWithHash to={resourcesTabFullyQualified} />;
  }

  const tagFiltersForResource = tagFilters.slice();
  tagFiltersForResource.push({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'resourceLoad' });
  tagFiltersForResource.push({ name: 'beacon.http.origin', stringValue: resourceId, operator: 'EQUALS' });

  let content;
  if (result.progress.loading) {
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
            <KpiCard title="Origin" value={resourceId} />
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <WebsiteBeaconGroupsChartWrapper
              cardTitle="Resource Loads"
              timeConfig={timeConfig}
              tagFilters={tagFiltersForResource}
              group={{
                groupbyTag: 'beacon.resourceType'
              }}
              metricIds={getResourceTypes()}
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
              translateLabel={label => resourceTypes[label] && resourceTypes[label].long}
              translateColor={label => resourceTypes[label] && resourceTypes[label].color}
            />
          </Col>

          <Col lg={6}>
            <WebsiteChartWrapper
              cardTitle="Retrieval Time"
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
                tagFilters: tagFiltersForResource,
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

        {!hasDetailedTimings && (
          <Row>
            <Col xs={12}>
              <LimitedCapabilitiesCard
                cardTitle="Resource Timings Not Available"
                explanation={explanation}
                learnMoreHref={learnMoreHref}
                learnMoreLabel={learnMoreLabel}
              />
            </Col>
          </Row>
        )}

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
                      tagFilters: tagFiltersForResource,
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

        {hasDetailedTimings && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                cardTitle="Caching Statistics"
                timeConfig={timeConfig}
                tagFilters={tagFiltersForResource}
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

            <Col xs={6}>
              <WebsiteBeaconGroupsChartWrapper
                cardTitle="Resource Sizes"
                timeConfig={timeConfig}
                tagFilters={tagFiltersForResource}
                group={{
                  groupbyTag: 'beacon.resourceType'
                }}
                metricIds={getResourceTypes()}
                metrics={[
                  {
                    label: 'Transfer Size',
                    metric: 'transferSize',
                    aggregation: 'MEAN',
                    formatter: bytes,
                    renderer: Renderer.stackedBar
                  },
                  {
                    label: 'Encoded Body Size',
                    metric: 'encodedBodySize',
                    aggregation: 'MEAN',
                    formatter: bytes,
                    renderer: Renderer.stackedBar
                  },
                  {
                    label: 'Decoded Body Size',
                    metric: 'decodedBodySize',
                    aggregation: 'MEAN',
                    formatter: bytes,
                    renderer: Renderer.stackedBar
                  }
                ]}
                translateLabel={label => resourceTypes[label] && resourceTypes[label].long}
                translateColor={label => resourceTypes[label] && resourceTypes[label].color}
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
                tagFilters={tagFiltersForResource}
                timeConfig={timeConfig}
              />
            </Col>
          )}
          <Col lg={pageId == null ? 4 : 6}>
            <LocationsTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersForResource}
              timeConfig={timeConfig}
              pageId={pageId}
            />
          </Col>
          <Col lg={pageId == null ? 4 : 6}>
            <ResourceTypesTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersForResource}
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
      <Breadcrumbs items={[<Breadcrumb label="Resource Details">{resourceId}</Breadcrumb>]} />
      <Title title="Resource Details" dynamic={resourceId} />
      <BackButton
        label="Back to list of resources"
        href$={getLinkToWebsite(websiteId, { tabPath: '/resources', pageId })}
      />
      {content}
    </Fragment>
  );
}
