/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React, { Fragment } from 'react';
import theme from 'in-themes';
import { t } from 'in-i18n';

import {
  getLinkToWebsite,
  resourcesTabFullyQualified,
  getLinkToAnalyze,
  resourcesTab,
  detailsPath
} from 'in-websites/navigation/paths';
import {
  getResourceTypes,
  types as resourceTypes
} from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import WebsiteBeaconGroupsChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteBeaconGroupsChartWrapper';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import ResourceTypesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/ResourceTypesTopList';
import AggregationSelectorWithUrlState from 'in-new-components/AggregationSelectorWithUrlState';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import LocationsTopList from 'in-websites/WebsiteDashboard/tabs/Resources/LocationsTopList';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { resourceId as resourceIdMatrixParameter } from 'in-websites/navigation/matrix';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Resources/PagesTopList';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { bytes, millis, number } from 'in-services/formatters/number';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
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
    long: t('in-websites:websiteDashboard.tabs.resources.resourceCacheTypesFullLoad')
  },
  validated: {
    long: t('in-websites:websiteDashboard.tabs.resources.resourceCacheTypesValidated')
  },
  cached: {
    long: t('in-websites:websiteDashboard.tabs.resources.resourceCacheTypesCached')
  },
  unknown: {
    long: t('in-websites:websiteDashboard.tabs.resources.resourceCacheTypesUnknown')
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
            <KpiCard title={t('in-websites:websiteDashboard.tabs.resources.resourceTitleOrigin')} value={resourceId} />
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <WebsiteBeaconGroupsChartWrapper
              cardTitle={t('in-websites:websiteDashboard.tabs.resources.resourceCardTitleResourceLoads')}
              timeConfig={timeConfig}
              tagFilters={tagFiltersForResource}
              viewInAnalytics={viewInAnalytics}
              group={{
                groupbyTag: 'beacon.resourceType'
              }}
              metricIds={getResourceTypes()}
              metrics={[
                {
                  label: t('in-websites:websiteDashboard.tabs.resources.'),
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
              cardTitle={t('in-websites:websiteDashboard.tabs.resources.resourceCardTitleRetrievalTime')}
              reverseTooltipOrder
              shareMaxAxisDomain
              timeConfig={timeConfig}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.integral,
                calculateStackDifferences: true,
                formatter: millis.forcedFixedCompact,
                labels: [
                  t('in-websites:websiteDashboard.tabs.resources.resourceLabel50th'),
                  t('in-websites:websiteDashboard.tabs.resources.resourceLabel90th'),
                  t('in-websites:websiteDashboard.tabs.resources.resourceLabel95th'),
                  t('in-websites:websiteDashboard.tabs.resources.resourceLabel99th'),
                  t('in-websites:websiteDashboard.tabs.resources.resourceLabelMax')
                ],
                defaultDisabledMetrics: ['onLoadTimeMax'],
                metricIds: ['onLoadTime50th', 'onLoadTime90th', 'onLoadTime95th', 'onLoadTime99th', 'onLoadTimeMax']
              }}
              y2={{
                renderer: Renderer.line,
                formatter: millis.forcedFixedCompact,
                labels: [t('in-websites:websiteDashboard.tabs.resources.resourceLabelMean')],
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
                title={t('in-websites:websiteDashboard.tabs.resources.resourceTitleResourceTimingsNotAvailable')}
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
              <AggregationSelectorWithUrlState
                defaultAggregation="MEAN"
                urlMatrixParamConfig={{ path: detailsPath, paramName: 'resourceTimingAgg' }}
              >
                {({ aggregation, aggregationSelector }) => (
                  <WebsiteChartWrapper
                    cardTitle={t('in-websites:websiteDashboard.tabs.resources.resourceCardTitleResourceTiming')}
                    cardHeader={aggregationSelector}
                    timeConfig={timeConfig}
                    shareMaxAxisDomain
                    viewInAnalytics={viewInAnalytics}
                    y1={{
                      renderer: Renderer.stackedBar,
                      formatter: millis.forcedFixedCompact,
                      labels: [
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelRedirect'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelAppCache'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelDNS'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelTCP'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelSSL'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelRequest'),
                        t('in-websites:websiteDashboard.tabs.resources.resourceLabelResponse')
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
                      labels: [t('in-websites:websiteDashboard.tabs.resources.resourceLabelTimeToFirstByte')],
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
              </AggregationSelectorWithUrlState>
            </Col>
          </Row>
        )}

        {hasDetailedTimings && (
          <Row>
            <Col lg={6}>
              <WebsiteBeaconGroupsChartWrapper
                cardTitle={t('in-websites:websiteDashboard.tabs.resources.resourceCardTitleCachingStatistics')}
                timeConfig={timeConfig}
                tagFilters={tagFiltersForResource}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.cacheInteraction'
                }}
                metricIds={Object.keys(cacheTypes).sort()}
                metrics={[
                  {
                    label: t('in-websites:websiteDashboard.tabs.resources.resourceLabelCount'),
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
                cardTitle={t('in-websites:websiteDashboard.tabs.resources.resourceCardTitleResourceSizes')}
                timeConfig={timeConfig}
                tagFilters={tagFiltersForResource}
                viewInAnalytics={viewInAnalytics}
                group={{
                  groupbyTag: 'beacon.resourceType'
                }}
                metricIds={getResourceTypes()}
                metrics={[
                  {
                    label: t('in-websites:websiteDashboard.tabs.resources.resourceLabelTransferSize'),
                    metric: 'transferSize',
                    aggregation: 'MEAN',
                    formatter: bytes,
                    renderer: Renderer.stackedBar
                  },
                  {
                    label: t('in-websites:websiteDashboard.tabs.resources.resourceLabelEncodedBodySize'),
                    metric: 'encodedBodySize',
                    aggregation: 'MEAN',
                    formatter: bytes,
                    renderer: Renderer.stackedBar
                  },
                  {
                    label: t('in-websites:websiteDashboard.tabs.resources.resourceLabelDecodedBodySize'),
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
                tab={resourcesTab}
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
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pathsTab' }}
            />
          </Col>
          <Col lg={pageId == null ? 4 : 6}>
            <ResourceTypesTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFiltersForResource}
              timeConfig={timeConfig}
              pageId={pageId}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'typesTab' }}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Title
        title={t('in-websites:websiteDashboard.tabs.resources.resourceTitleWebsiteResourceDetails')}
        dynamic={resourceId}
      />

      <div className={locals.actions}>
        <BackButton
          label={t('in-websites:websiteDashboard.tabs.resources.resourceLabelBackToListOfResourceOrigins')}
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
          {t('in-websites:websiteDashboard.tabs.resources.resourceButtonAnalyzeResourceOrigin')}
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
