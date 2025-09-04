/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';

import { TimeConfig, TagFilter } from '@instana/types';
import { Card, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { just } from '@instana/observables';

// @ts-expect-error Could not find a declaration file for module
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import {
  performanceTabFullyQualified,
  detailsPath,
  useGetLinkToMobileApp,
  useLinkToAnalyze
} from 'in-mobile-apps/navigation/paths';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
// @ts-expect-error Could not find a declaration file for module
import RedirectWithHash from 'in-components/RedirectWithHash';
import BeaconStack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStack';
// @ts-expect-error Could not find a declaration file for module
import connectTo from 'in-hoc/connectTo';
import MobileAppBigNumberCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppBigNumberCard';
import MobileAppMarkerLane from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMarkerLane';
import MobileAppTopList from 'in-mobile-apps/MobileAppDashboard/components/MobileAppTopList';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import BackButton from 'in-components/BackButton';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-mobile-apps/MobileAppDashboard/tabs/Crashes/Crash.mless';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, number.compact];
const labels = [
  t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
  t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')
];

const beaconTypePerf = 'perf';
const viewGroupByFilter = 'mobileBeacon.view.name';
const deviceGroupByFilter = 'mobileBeacon.device.model';
const osGroupByFilter = 'mobileBeacon.os.nameVersion';
const appVersionGroupByFilter = 'mobileBeacon.app.version';

interface AnrStackTraceProp {
  location: any;
  timeConfig: TimeConfig;
  mobileAppId: string;
}

export default connectTo(({ location, timeConfig, mobileAppId }: AnrStackTraceProp) => {
  const observables: Record<string, any> = {};

  const anrId = getMatrixParameter(location, '/details', 'anrId');
  observables.anrId = just(anrId);
  if (anrId) {
    observables.result = getMobileAppBeacons({
      tagFilters: [
        {
          name: 'mobileBeacon.type',
          stringValue: beaconTypePerf,
          operator: 'EQUALS',
          type: 'TAG_FILTER',
          entity: 'NOT_APPLICABLE'
        },
        {
          name: 'mobileBeacon.mobileApp.id',
          stringValue: mobileAppId,
          operator: 'EQUALS',
          type: 'TAG_FILTER',
          entity: 'NOT_APPLICABLE'
        },
        {
          name: 'mobileBeacon.anrStack.label',
          stringValue: anrId,
          operator: 'EQUALS',
          type: 'TAG_FILTER',
          entity: 'NOT_APPLICABLE'
        }
      ],
      timeConfig: timeConfig,
      order: {
        by: 'mobileBeacon.timestamp',
        direction: 'DESC'
      },
      pagination: {
        retrievalSize: 1
      }
    });
  }
  return observables;
})(AnrStackTraceTab);

interface AnrStackTraceTabProp {
  anrId: string;
  result: any;
  mobileAppId: string;
  mobileAppLabel: string;
  viewId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
}

function AnrStackTraceTab({
  anrId,
  result,
  mobileAppId,
  mobileAppLabel,
  viewId,
  tagFilters,
  timeConfig
}: AnrStackTraceTabProp) {
  const tagCatalogPerf = useTagCatalog('perf');

  const tagFiltersWithAnrAnalyze = tagFilters.slice();
  tagFiltersWithAnrAnalyze.push({
    name: 'mobileBeacon.performanceSubtype',
    stringValue: 'App not responding or freezing',
    operator: 'EQUALS',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });

  const tagFiltersWithAnr = tagFilters.slice();
  tagFiltersWithAnr.push({
    name: 'mobileBeacon.anrStack.label',
    stringValue: anrId,
    operator: 'EQUALS',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });

  if (anrId) {
    tagFiltersWithAnrAnalyze.push({
      name: 'mobileBeacon.anrStack.label',
      stringValue: anrId,
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    });
  }

  const occurencesAnalyzeHref = useLinkToAnalyze();

  const usersAnalyzeHref = useLinkToAnalyze();

  const analyzeCrashesHref = useLinkToAnalyze();

  const mobileAppHref = useGetLinkToMobileApp(mobileAppId, { tabPath: '/performance', viewId });

  if (!anrId) {
    return <RedirectWithHash to={performanceTabFullyQualified} />;
  }

  const MarkerLane = MobileAppMarkerLane({ mobileAppId });

  let content;
  if (result.progress.loading) {
    content = <DefaultLoadingDashboard />;
  } else if (result.errors && result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else {
    const granularity = getChartGranularity(timeConfig);
    const viewInAnalytics = {
      mobileAppLabel,
      group: {
        groupbyTag: 'mobileBeacon.performanceSubtype'
      }
    };

    const firstBeacon = result.data?.items?.[0]?.beacon;
    content = (
      <Fragment>
        <Row>
          <Col lg={3}>
            <MobileAppBigNumberCard
              title={t('in-mobile-apps:dashboard.tabs.occurrencesLabel')}
              metric={'beaconCount'}
              aggregation={'SUM'}
              formatter={number.compact}
              timeConfig={timeConfig}
              tagFilters={tagFiltersWithAnr}
              iconAction={{
                text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href:
                  tagCatalogPerf &&
                  occurencesAnalyzeHref({
                    beaconType: 'perf',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      mobileAppLabel,
                      tagFilters: tagFiltersWithAnrAnalyze,
                      tagCatalog: tagCatalogPerf
                    }),
                    groupBy: {
                      groupbyTag: 'mobileBeacon.performanceSubtype'
                    }
                  })
              }}
            />
          </Col>
          <Col lg={3}>
            <MobileAppBigNumberCard
              title={t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')}
              metric={'uniqueUsersOrSessions'}
              aggregation={'DISTINCT_COUNT'}
              formatter={number.compact}
              timeConfig={timeConfig}
              tagFilters={tagFiltersWithAnr}
              iconAction={{
                text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href:
                  tagCatalogPerf &&
                  usersAnalyzeHref({
                    beaconType: 'perf',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      mobileAppLabel,
                      tagFilters: tagFiltersWithAnrAnalyze,
                      tagCatalog: tagCatalogPerf
                    }),
                    groupBy: {
                      groupbyTag: 'mobileBeacon.performanceSubtype'
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
        </Row>

        {firstBeacon && (
          <Row>
            <Col lg={12}>
              <Card title={t('in-mobile-apps:dashboard.tabs.performance.anrInfoTitle')}>
                <Dl>
                  <Di title={t('in-mobile-apps:dashboard.tabs.performance.anrMessage')}>ANR</Di>
                </Dl>
                <BeaconStack
                  beacon={firstBeacon}
                  textProp={t(
                    'in-mobile-apps:sessionView.tabsSumPerformanceBeacon.stackTraceButtonFocusedThreadsStackTrace'
                  )}
                  optionalLabel
                />
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={4}>
            <MobileAppChartWrapper
              title={t('in-mobile-apps:dashboard.tabs.occurrencesLabel')}
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: number.forcedCompact,
                labels: [t('in-mobile-apps:dashboard.tabs.occurrencesLabel')],
                metricIds: ['beaconCount'],
                colors: [themes.default.ids.color.option.red['500']]
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters: tagFiltersWithAnr,
                metrics: {
                  beaconCount: {
                    metric: 'beaconCount',
                    granularity,
                    aggregation: 'SUM',
                    omitMetricInAnalytics: true,
                    beaconType: 'perf'
                  }
                }
              }}
              renderPostChartContent={MarkerLane}
            />
          </Col>
          <Col lg={4}>
            <MobileAppChartWrapper
              title={t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')}
              timeConfig={timeConfig}
              renderLegend={false}
              viewInAnalytics={viewInAnalytics}
              y1={{
                renderer: Renderer.bar,
                formatter: number.compact,
                labels: [t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')],
                metricIds: ['uniqueUsersOrSessions']
              }}
              metricsConfiguration={{
                timeConfig,
                tagFilters: tagFiltersWithAnr,
                metrics: {
                  uniqueUsersOrSessions: {
                    metric: 'uniqueUsersOrSessions',
                    granularity,
                    aggregation: 'DISTINCT_COUNT',
                    beaconType: 'perf'
                  }
                }
              }}
              renderPostChartContent={MarkerLane}
            />
          </Col>
          <Col lg={4}>
            <MobileAppTopList
              title={t('in-mobile-apps:dashboard.tabs.appVersions')}
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              timeConfig={timeConfig}
              tagFilters={tagFiltersWithAnr}
              tagFiltersAnalyze={tagFiltersWithAnrAnalyze}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconTypePerf}
              beaconGroupByFilter={appVersionGroupByFilter}
              linkToAllLabel={t('in-mobile-apps:dashboard.tabs.viewAllVersions')}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'appversionsTab', paramMetric: 'beaconCount' }}
              renderHistoricDataIndicator
            />
          </Col>
        </Row>

        <Row>
          {viewId == null && (
            <Col lg={4}>
              <MobileAppTopList
                title={t('in-mobile-apps:dashboard.tabs.viewsTitle')}
                mobileAppId={mobileAppId}
                mobileAppLabel={mobileAppLabel}
                timeConfig={timeConfig}
                tagFilters={tagFiltersWithAnr}
                tagFiltersAnalyze={tagFiltersWithAnrAnalyze}
                metrics={metrics}
                labels={labels}
                aggregations={aggregations}
                formatters={formatters}
                beaconType={beaconTypePerf}
                beaconGroupByFilter={viewGroupByFilter}
                linkToAllLabel={t('in-mobile-apps:dashboard.tabs.viewAllViewsLink')}
                urlMatrixParamConfig={{ path: detailsPath, paramTab: 'viewsTab', paramMetric: 'beaconCount' }}
                renderHistoricDataIndicator
              />
            </Col>
          )}
          <Col lg={viewId == null ? 4 : 6}>
            <MobileAppTopList
              title={t('in-mobile-apps:dashboard.tabs.devices')}
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              timeConfig={timeConfig}
              tagFilters={tagFiltersWithAnr}
              tagFiltersAnalyze={tagFiltersWithAnrAnalyze}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconTypePerf}
              beaconGroupByFilter={deviceGroupByFilter}
              linkToAllLabel={t('in-mobile-apps:dashboard.tabs.viewAllDevices')}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'devicesTab', paramMetric: 'beaconCount' }}
              renderHistoricDataIndicator
            />
          </Col>
          <Col lg={viewId == null ? 4 : 6}>
            <MobileAppTopList
              title={t('in-mobile-apps:dashboard.tabs.osVersions')}
              mobileAppId={mobileAppId}
              mobileAppLabel={mobileAppLabel}
              timeConfig={timeConfig}
              tagFilters={tagFiltersWithAnr}
              tagFiltersAnalyze={tagFiltersWithAnrAnalyze}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconTypePerf}
              beaconGroupByFilter={osGroupByFilter}
              linkToAllLabel={t('in-mobile-apps:dashboard.tabs.viewAllOs')}
              urlMatrixParamConfig={{ path: detailsPath, paramTab: 'platformsTab', paramMetric: 'beaconCount' }}
              renderHistoricDataIndicator
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className={locals.actions}>
        <BackButton
          label={t('in-mobile-apps:dashboard.tabs.performance.backToPerfTab')}
          href={mobileAppHref}
          withoutMargin
        />

        <Button
          kind="secondary"
          href={
            tagCatalogPerf &&
            analyzeCrashesHref({
              beaconType: 'perf',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters: tagFiltersWithAnrAnalyze,
                tagCatalog: tagCatalogPerf
              }),
              groupBy: {}
            })
          }
        >
          {t('in-mobile-apps:dashboard.tabs.performance.anrButtonAnalyzeANR')}
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
