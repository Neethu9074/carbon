import { just } from 'reactive-observables';
import React, { Fragment } from 'react';
import theme from 'in-themes';

import {
  getResourceTypes,
  types as resourceTypes
} from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import { getLinkToWebsite, resourcesTabFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import ResourceTypesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/ResourceTypesTopList';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Resources/LocationsTopList';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { resourceId as resourceIdMatrixParameter } from 'in-websites/navigation/matrix';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/PagesTopList';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import RedirectWithHash from 'in-components/RedirectWithHash';
import AggregationSelector from 'in-new-components/AggregationSelector';
import { bytes, millis, number } from 'in-services/formatters/number';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Footer from 'in-new-components/Footer';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './Resource.mless';

export const cacheTypes = {
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
      tagFilters: tagFilters
        .concat({ name: 'beacon.http.origin', stringValue: resourceId, operator: 'EQUALS' })
        .concat({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'resourceLoad' }),
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
  if (!result || result.progress.loading) {
    content = <DefaultLoadingDashboard />;
  } else if (result.errors && result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else {
    const granularity = getChartGranularity(timeConfig);
    const hasDetailedTimings = result.data && result.data['requestTime'] && result.data['requestTime'].length > 0.0;
    const viewInAnalytics = {
      websiteLabel,
      group: {
        groupbyTag: 'beacon.http.path'
      }
    };

    const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });

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
              viewInAnalytics={viewInAnalytics}
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>

          <Col lg={6}>
            <WebsiteChartWrapper
              cardTitle="Retrieval Time"
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
                tagFilters: tagFiltersForResource,
                metrics: {
                  onLoadTime50th: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'P50',
                    beaconType: 'resourceLoad'
                  },
                  onLoadTime90th: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'P90',
                    beaconType: 'resourceLoad'
                  },
                  onLoadTime95th: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'P95',
                    beaconType: 'resourceLoad'
                  },
                  onLoadTime99th: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'P99',
                    beaconType: 'resourceLoad'
                  },
                  onLoadTimeMax: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'MAX',
                    beaconType: 'resourceLoad'
                  },
                  onLoadTimeMean: {
                    metric: 'beaconDuration',
                    granularity,
                    aggregation: 'MEAN',
                    beaconType: 'resourceLoad'
                  }
                }
              }}
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>

        {!hasDetailedTimings && (
          <Row>
            <Col xs={12}>
              <LearnMoreCard
                title="Resource Timings Not Available"
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
                      tagFilters: tagFiltersForResource,
                      metrics: {
                        redirectTime: {
                          metric: 'redirectTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        appCacheTime: {
                          metric: 'appCacheTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        dnsTime: {
                          metric: 'dnsTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        tcpTime: {
                          metric: 'tcpTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        sslTime: {
                          metric: 'sslTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        requestTime: {
                          metric: 'requestTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        responseTime: {
                          metric: 'responseTime',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        },
                        ttfb: {
                          metric: 'ttfb',
                          granularity,
                          aggregation,
                          beaconType: 'resourceLoad'
                        }
                      }
                    }}
                    renderPostChartContent={MarkerLanes}
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
              <WebsiteBeaconGroupsChartWrapper
                cardTitle="Resource Sizes"
                timeConfig={timeConfig}
                tagFilters={tagFiltersForResource}
                viewInAnalytics={viewInAnalytics}
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
                renderPostChartContent={MarkerLanes}
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
      <Title title="Website Resource Details" dynamic={resourceId} />

      <div className={locals.actions}>
        <BackButton
          label="Back to list of resource origins"
          href$={getLinkToWebsite(websiteId, { tabPath: '/resources', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={getLinkToAnalyze({
            beaconType: 'resourceLoad',
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              websiteLabel,
              tagFilters: tagFilters.concat([
                { name: 'beacon.http.origin', stringValue: resourceId, operator: 'EQUALS' }
              ])
            }),
            group: {
              groupbyTag: 'beacon.http.path'
            }
          })}
        >
          Analyze Resource Origin
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
