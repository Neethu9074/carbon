/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Deprecations from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecations';
import AggregationSelectorWithUrlState from 'in-components/AggregationSelectorWithUrlState';
import WebsiteGeoHeatMap from 'in-websites/WebsiteDashboard/components/WebsiteGeoHeatMap';
import { number, millis, meanLatency, latency } from 'in-services/formatters/number';
import ErrorTopList from 'in-websites/WebsiteDashboard/tabs/Summary/ErrorTopList';
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getLinkToAnalyze, summaryTab } from 'in-websites/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { Row, Col } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Summary({ websiteId, tagFilters, timeConfig, pageId, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);
  const tagCatalogPageLoad = useTagCatalog('pageLoad');
  const tagCatalogPageChange = useTagCatalog('pageChange');

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId, pageId });

  return (
    <Fragment>
      <Row>
        <Col xs>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.summary.summaryTitlePageLoads')}
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
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.summary.summaryIconTextViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogPageLoad &&
                getLinkToAnalyze({
                  beaconType: 'pageLoad',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogPageLoad
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  }
                })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.summary.summaryTitlePageTransitions')}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                pageTransitions: {
                  metric: 'pageTransitions',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.summary.summaryIconTextViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogPageChange &&
                getLinkToAnalyze({
                  beaconType: 'pageChange',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogPageChange
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.page.name'
                  }
                })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.summary.summaryTitleOnLoadTimeMean')}
            formatter={meanLatency.detailed}
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
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.summary.summaryIconTextViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogPageLoad &&
                getLinkToAnalyze({
                  beaconType: 'pageLoad',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogPageLoad
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  },
                  fields: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'MEAN',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P90',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P95',
                      type: metricType
                    }
                  ],
                  chartedMetrics: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'MEAN'
                    }
                  ]
                })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.summary.summaryTitleOnLoadTime90th')}
            formatter={latency.detailed}
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
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.summary.summaryIconTextViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogPageLoad &&
                getLinkToAnalyze({
                  beaconType: 'pageLoad',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogPageLoad
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  },
                  fields: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'MEAN',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P90',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P95',
                      type: metricType
                    }
                  ],
                  chartedMetrics: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P90'
                    }
                  ]
                })
            }}
          />
        </Col>
        <Col xs>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.summary.summaryTitleOnLoadTime95th')}
            formatter={latency.detailed}
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
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.summary.summaryIconTextViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogPageLoad &&
                getLinkToAnalyze({
                  beaconType: 'pageLoad',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogPageLoad
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  },
                  fields: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'MEAN',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P90',
                      type: metricType
                    },
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P95',
                      type: metricType
                    }
                  ],
                  chartedMetrics: [
                    {
                      metricId: 'beaconDuration',
                      aggregationId: 'P95'
                    }
                  ]
                })
            }}
          />
        </Col>
      </Row>

      <Deprecations tagFilters={tagFilters} timeConfig={timeConfig} websiteId={websiteId} websiteLabel={websiteLabel} />

      <Row>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.summary.summaryCardTitlePageViews')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: [
                t('in-websites:websiteDashboard.tabs.summary.summaryLabelPageLoads'),
                t('in-websites:websiteDashboard.tabs.summary.summaryLabelPageTransitions')
              ],
              metricIds: ['pageLoads', 'pageTransitions']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  granularity,
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'pageLoad'
                },
                pageTransitions: {
                  metric: 'pageTransitions',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={4}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.summary.summaryCardTitleJSErrors')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.summary.summaryLabelJSErrors')],
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
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'error'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={4}>
          <AggregationSelectorWithUrlState
            defaultAggregation="MEAN"
            urlMatrixParamConfig={{ path: summaryTab, paramName: 'onLoadAgg' }}
          >
            {({ aggregation, aggregationSelector }) => (
              <WebsiteChartWrapper
                cardTitle={t('in-websites:websiteDashboard.tabs.summary.summaryCardTitleOnLoadTime')}
                cardHeader={aggregationSelector}
                timeConfig={timeConfig}
                viewInAnalytics={{
                  websiteLabel
                }}
                y1={{
                  renderer: Renderer.line,
                  formatter: millis.forcedFixedCompact,
                  labels: [t('in-websites:websiteDashboard.tabs.summary.summaryLabelOnLoadTime')],
                  metricIds: ['onLoadTime']
                }}
                metricsConfiguration={{
                  timeConfig,
                  tagFilters,
                  metrics: {
                    onLoadTime: {
                      metric: 'onLoadTime',
                      granularity,
                      aggregation,
                      analyzeMetricName: 'beaconDuration',
                      beaconType: 'pageLoad'
                    }
                  }
                }}
                renderPostChartContent={MarkerLanes}
              />
            )}
          </AggregationSelectorWithUrlState>
        </Col>
      </Row>

      <Row>
        <Col lg={pageId == null ? 4 : 6}>
          <Card title={t('in-websites:websiteDashboard.tabs.summary.summaryTitleGeography')} withoutPadding>
            <WebsiteGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <ErrorTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            websiteId={websiteId}
            pageId={pageId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'jsErrorsTab' }}
          />
        </Col>
        {pageId == null && (
          <Col lg={4}>
            <PagesTopList
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              websiteId={websiteId}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'pagesTab' }}
            />
          </Col>
        )}
      </Row>
      <Footer />
    </Fragment>
  );
}
