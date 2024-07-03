/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig, TagFilter } from '@instana/types';
import { Button } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
// @ts-expect-error Could not find a declaration file for module
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
// @ts-expect-error Could not find a declaration file for module
import { customEventId as customEventIdMatrixParameter } from 'in-mobile-apps/navigation/matrix';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import { customEventsTabFullyQualified } from 'in-mobile-apps/navigation/paths';
// @ts-expect-error Could not find a declaration file for module
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
// @ts-expect-error Could not find a declaration file for module
import RedirectWithHash from 'in-components/RedirectWithHash';
import { detailsPath, useGetLinkToMobileApp, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import PlatformTopList from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents/PlatformTopList';
import ViewTopList from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents/ViewTopList';
import OsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents/OsTopList';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { millis, number } from 'in-services/formatters/number';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import BackButton from 'in-components/BackButton';
import Footer from 'in-components/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './CustomEvent.mless';

export interface CustomEventProp {
  location: any;
  tagFilters: Array<TagFilter>;
  timeConfig: TimeConfig;
  mobileAppId: string;
  viewId?: string;
  mobileAppLabel: string;
}

export default function CustomEvent({
  location,
  tagFilters,
  timeConfig,
  mobileAppId,
  viewId,
  mobileAppLabel
}: CustomEventProp) {
  const tagCatalogCustom = useTagCatalog('custom');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const customEventId = getMatrixParameter(location, '/details', customEventIdMatrixParameter);
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, { tabPath: '/customEvents', viewId });

  if (!customEventId) {
    return <RedirectWithHash to={customEventsTabFullyQualified} />;
  }

  const granularity = getChartGranularity(timeConfig);
  tagFilters = tagFilters.concat([
    {
      name: 'mobileBeacon.type',
      stringValue: 'custom',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    },
    {
      name: 'mobileBeacon.customEvent.name',
      stringValue: customEventId,
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    }
  ]);
  const viewInAnalytics = {
    mobileAppLabel,
    group: {
      groupbyTag: 'mobileBeacon.view.name'
    }
  };
  const MarkerLane = MobileAppMarkerLane({ mobileAppId });

  return (
    <>
      <Title
        title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleMobileAppCustomEventDetails')}
        dynamic={customEventId}
      />

      <div className={locals.actions}>
        <BackButton
          label={t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelBackToListOfCustomEvents')}
          href={linkToMobileAppHref}
          withoutMargin
        />

        <Button
          kind="secondary"
          href={
            tagCatalogCustom &&
            getLinkToMobileAppAnalyze({
              beaconType: 'custom',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters,
                tagCatalog: tagCatalogCustom
              }),
              groupBy: {
                groupbyTag: 'mobileBeacon.view.name'
              }
            })
          }
        >
          {t('in-mobile-apps:dashboard.tabs.customEvents.customEventButtonAnalyzeCustomEvent')}
        </Button>
      </div>

      <Row>
        <Col lg={3}>
          <MobileAppMetricsKpiCard
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleOccurrences')}
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
              text: t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href:
                tagCatalogCustom &&
                getLinkToMobileAppAnalyze({
                  beaconType: 'custom',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    mobileAppLabel,
                    tagFilters,
                    tagCatalog: tagCatalogCustom
                  }),
                  groupBy: {
                    groupbyTag: 'mobileBeacon.view.name'
                  }
                })
            }}
          />
        </Col>
        <Col lg={3}>
          <MobileAppMetricsKpiCard
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleUsers')}
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
              text: t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelViewInAnalyze'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href:
                tagCatalogCustom &&
                getLinkToMobileAppAnalyze({
                  beaconType: 'custom',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    mobileAppLabel,
                    tagFilters,
                    tagCatalog: tagCatalogCustom
                  }),
                  groupBy: {
                    groupbyTag: 'mobileBeacon.view.name'
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
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleCustomEvent')}
            value={customEventId}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleOccurrences')}
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: [t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelOccurrences')],
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
        <Col lg={6}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleUsers')}
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.bar,
              formatter: affectedUsersChart,
              labels: [t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelUsers')],
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.customEvents.customEventTitleDuration')}
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: [
                t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabel50th'),
                t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabel90th'),
                t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabel95th'),
                t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabel99th'),
                t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelMax')
              ],
              defaultDisabledMetrics: ['durationMax'],
              metricIds: ['duration50th', 'duration90th', 'duration95th', 'duration99th', 'durationMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-mobile-apps:dashboard.tabs.customEvents.customEventLabelMean')],
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
            renderPostChartContent={MarkerLane}
          />
        </Col>
      </Row>

      <Row>
        {viewId == null && (
          <Col lg={4}>
            <ViewTopList
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              tagFilters={tagFilters}
              timeConfig={timeConfig}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'pagesTab', paramMetric: 'beaconCount' }}
            />
          </Col>
        )}
        <Col lg={viewId == null ? 4 : 6}>
          <PlatformTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'platformTab', paramMetric: 'beaconCount' }}
          />
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <OsTopList
            mobileAppId={mobileAppId}
            mobileAppLabel={mobileAppLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            urlMatrixParamConfig={{ path: detailsPath, paramTab: 'osTab', paramMetric: 'beaconCount' }}
          />
        </Col>
      </Row>
      <Footer />
    </>
  );
}
