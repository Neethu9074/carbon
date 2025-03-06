/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';

// @ts-expect-error Could not find a declaration file for module
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
// @ts-expect-error Could not find a declaration file for module
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import MobileAppBigNumberCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppBigNumberCard';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import { number, percentage, millis, seconds } from 'in-services/formatters/number';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { chartColors, carbonCategorical } from 'in-themes/chartColors';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Col, Row } from 'in-components/layout/Grid';
import { TimeConfig, TagFilter } from 'in-types';
import { t } from 'in-i18n';

interface PerformanceProp {
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  mobileAppLabel: string;
  mobileAppId: string;
}

export default function Performance({ tagFilters, timeConfig, mobileAppLabel, mobileAppId }: PerformanceProp) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const tagCatalogCrash = useTagCatalog('crash');
  const tagCatalogPerf = useTagCatalog('perf');
  const tagFiltersForRequests = tagFilters.slice();
  const tagFiltersForColdStart = tagFilters.slice();
  tagFiltersForColdStart.push({
    name: 'mobileBeacon.performanceSubtype',
    operator: 'EQUALS',
    stringValue: 'ast',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });
  tagFiltersForRequests.push({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'perf',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });
  const granularity = getChartGranularity(timeConfig);
  const viewInAnalytics = {
    mobileAppLabel,
    group: {
      groupbyTag: 'mobileBeacon.performanceSubtype'
    }
  };

  const MarkerLane = MobileAppMarkerLane({ mobileAppId });

  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <MobileAppMetricsKpiCard
          title={t('in-mobile-apps:dashboard.tabs.coldStartTimeTitle')}
          formatter={seconds.fromMillisFixedDetailed}
          metricsConfig={{
            tagFilters,
            timeConfig,
            metrics: {
              mobileColdStart: {
                metric: 'mobileColdStart',
                aggregation: 'P75'
              }
            }
          }}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogPerf &&
              getLinkToMobileAppAnalyze({
                beaconType: 'perf',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters: tagFiltersForColdStart,
                  tagCatalog: tagCatalogPerf
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.performanceSubtype'
                },
                fields: [
                  {
                    metricId: 'mobileColdStart',
                    aggregationId: 'P75',
                    type: metricType
                  }
                ],
                chartedMetrics: [
                  {
                    metricId: 'mobileColdStart',
                    aggregationId: 'P75'
                  }
                ]
              })
          }}
        />

        <MobileAppBigNumberCard
          title={t('in-mobile-apps:dashboard.tabs.appNotRespondingAffectedSessionsTitle')}
          metric={'crashAffectedSessionRate'}
          aggregation={'MEAN'}
          formatter={percentage.detailed}
          companionMetric={'crashAffectedSessionCount'}
          companionAggregation={'DISTINCT_COUNT'}
          companionFormatter={v =>
            t('in-mobile-apps:dashboard.tabs.sessionCount', {
              formattedCount: number.compact(v),
              count: v
            })
          }
          comparisonColors={{
            decreaseColor: blue.id,
            increaseColor: blue.id
          }}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogCrash &&
              getLinkToMobileAppAnalyze({
                beaconType: 'crash',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters,
                  tagCatalog: tagCatalogCrash
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.crash.groupLabel'
                }
              })
          }}
        />
        <MobileAppBigNumberCard
          title={t('in-mobile-apps:dashboard.tabs.appNotRespondingAffectedUsersTitle')}
          metric={'crashAffectedUserRate'}
          aggregation={'MEAN'}
          formatter={percentage.detailed}
          companionMetric={'crashAffectedUserCount'}
          companionAggregation={'DISTINCT_COUNT'}
          companionFormatter={v =>
            t('in-mobile-apps:dashboard.tabs.userCount', {
              formattedCount: number.compact(v),
              count: v
            })
          }
          comparisonColors={{
            decreaseColor: blue.id,
            increaseColor: blue.id
          }}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          iconAction={{
            text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
            kind: 'subtle',
            icon: 'lib_analyze',
            href:
              tagCatalogCrash &&
              getLinkToMobileAppAnalyze({
                beaconType: 'crash',
                formModel: translateDemocratisationTagFiltersToFormModel({
                  mobileAppLabel,
                  tagFilters,
                  tagCatalog: tagCatalogCrash
                }),
                groupBy: {
                  groupbyTag: 'mobileBeacon.crash.groupLabel'
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
      </KpiGridRow>

      <Row>
        <Col lg={4}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.coldStartTimeGridTitle')}
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: [t('in-mobile-apps:dashboard.tabs.androidLabel'), t('in-mobile-apps:dashboard.tabs.iosLabel')],
              metricIds: ['onLoadTime50th', 'onLoadTimeMax'],
              colors: [chartColors.strokeColors25[2], chartColors.strokeColors100[0]]
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
                onLoadTimeMax: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MAX',
                  beaconType: 'httpRequest'
                }
              }
            }}
            renderPostChartContent={MarkerLane}
          />
        </Col>

        <Col lg={4}>
          <MobileAppChartWrapper
            title={t('in-mobile-apps:dashboard.tabs.appNotRespondingGridTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.barOverlapping,
              formatter: number.compact,
              labels: [t('in-mobile-apps:dashboard.tabs.androidLabel'), t('in-mobile-apps:dashboard.tabs.iosLabel')],
              metricIds: ['calls', 'errors'],
              colors: [chartColors.strokeColors100[0], chartColors.strokeColors25[1]]
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
            title={t('in-mobile-apps:dashboard.tabs.lowMemoryGridTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={viewInAnalytics}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.compact,
              labels: [t('in-mobile-apps:dashboard.tabs.androidLabel'), t('in-mobile-apps:dashboard.tabs.iosLabel')],
              metricIds: ['androidLowMemoryCount', 'iosLowMemoryCount'],
              colors: [carbonCategorical.purple50, carbonCategorical.red90]
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters: tagFiltersForRequests,
              metrics: {
                androidLowMemoryCount: {
                  metric: 'androidLowMemoryCount',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'perf',
                  omitMetricInAnalytics: true
                },
                iosLowMemoryCount: {
                  metric: 'iosLowMemoryCount',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'perf',
                  omitMetricInAnalytics: true
                }
              }
            }}
            renderPostChartContent={MarkerLane}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
