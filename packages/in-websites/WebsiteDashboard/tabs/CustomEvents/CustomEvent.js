/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getLinkToWebsite,
  getLinkToAnalyze,
  customEventsTabFullyQualified,
  detailsPath
} from 'in-websites/navigation/paths';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { customEventId as customEventIdMatrixParameter } from 'in-websites/navigation/matrix';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/BrowserTopList';
import PageTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/PageTopList';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/OsTopList';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { millis, number } from 'in-services/formatters/number';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './CustomEvent.mless';

export default function CustomEvent({ location, tagFilters, timeConfig, websiteId, pageId, websiteLabel }) {
  const tagCatalogCustom = useTagCatalog('custom');
  const customEventId = getMatrixParameter(location, '/details', customEventIdMatrixParameter);
  if (!customEventId) {
    return <RedirectWithHash to={customEventsTabFullyQualified} />;
  }

  const granularity = getChartGranularity(timeConfig);
  tagFilters = tagFilters.concat([{ name: 'beacon.customEvent.name', stringValue: customEventId, operator: 'EQUALS' }]);
  const viewInAnalytics = {
    websiteLabel,
    group: {
      groupbyTag: 'beacon.location.path'
    }
  };

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId, pageId });

  return (
    <>
      <Title
        title={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleWebsiteCustomEventDetails')}
        dynamic={customEventId}
      />

      <div className={locals.actions}>
        <BackButton
          label={t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelBackToListOfCustomEvents')}
          href$={getLinkToWebsite(websiteId, { tabPath: '/customEvents', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={
            tagCatalogCustom &&
            getLinkToAnalyze({
              beaconType: 'custom',
              formModel: translateDemocratisationTagFiltersToFormModel({
                websiteLabel,
                tagFilters,
                tagCatalog: tagCatalogCustom
              }),
              groupBy: {
                groupbyTag: 'beacon.location.path'
              }
            })
          }
        >
          {t('in-websites:websiteDashboard.tabs.customEvents.customEventButtonAnalyzeCustomEvent')}
        </Button>
      </div>

      <Row>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleOccurrences')}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                occurrences: {
                  metric: 'beaconCount',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogCustom &&
                getLinkToAnalyze({
                  beaconType: 'custom',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogCustom
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  }
                })
            }}
          />
        </Col>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleUsers')}
            formatter={affectedUsers.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                uniqueUsersOrSessions: {
                  metric: 'uniqueUsersOrSessions',
                  aggregation: 'DISTINCT_COUNT'
                }
              }
            }}
            iconAction={{
              text: t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogCustom &&
                getLinkToAnalyze({
                  beaconType: 'custom',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    websiteLabel,
                    tagFilters,
                    tagCatalog: tagCatalogCustom
                  }),
                  groupBy: {
                    groupbyTag: 'beacon.location.path'
                  },
                  fields: [
                    {
                      metricId: 'uniqueUsersOrSessions',
                      aggregationId: 'DISTINCT_COUNT',
                      type: metricType
                    }
                  ],
                  chartedMetrics: [
                    {
                      metricId: 'uniqueUsersOrSessions',
                      aggregationId: 'DISTINCT_COUNT'
                    }
                  ]
                })
            }}
          />
        </Col>
        <Col xs={6}>
          <KpiCard
            title={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleCustomEvent')}
            value={customEventId}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleOccurrences')}
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelOccurrences')],
              metricIds: ['beaconCount']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                beaconCount: {
                  metric: 'beaconCount',
                  granularity,
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'custom'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleUsers')}
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: affectedUsersChart,
              labels: [t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelUsers')],
              metricIds: ['uniqueUsersOrSessions']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                uniqueUsersOrSessions: {
                  metric: 'uniqueUsersOrSessions',
                  granularity,
                  aggregation: 'DISTINCT_COUNT',
                  beaconType: 'custom'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleDuration')}
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: [
                t('in-websites:websiteDashboard.tabs.customEvents.customEventLabel50th'),
                t('in-websites:websiteDashboard.tabs.customEvents.customEventLabel90th'),
                t('in-websites:websiteDashboard.tabs.customEvents.customEventLabel95th'),
                t('in-websites:websiteDashboard.tabs.customEvents.customEventLabel99th'),
                t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelMax')
              ],
              defaultDisabledMetrics: ['durationMax'],
              metricIds: ['duration50th', 'duration90th', 'duration95th', 'duration99th', 'durationMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.customEvents.customEventLabelMean')],
              defaultDisabledMetrics: ['durationMean'],
              metricIds: ['durationMean']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                duration50th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P50',
                  beaconType: 'custom'
                },
                duration90th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P90',
                  beaconType: 'custom'
                },
                duration95th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P95',
                  beaconType: 'custom'
                },
                duration99th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P99',
                  beaconType: 'custom'
                },
                durationMax: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MAX',
                  beaconType: 'custom'
                },
                durationMean: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MEAN',
                  beaconType: 'custom'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
      </Row>

      <Row>
        {pageId == null && (
          <Col lg={4}>
            <PageTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pagesTab' }}
            />
          </Col>
        )}
        <Col lg={pageId == null ? 4 : 6}>
          <BrowserTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            pageId={pageId}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'browserTab' }}
          />
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <OsTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            pageId={pageId}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'osTab' }}
          />
        </Col>
      </Row>
      <Footer />
    </>
  );
}
