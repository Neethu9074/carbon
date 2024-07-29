/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
  crashesTabFullyQualified,
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
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './Crash.mless';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, number.compact];
const labels = [
  t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
  t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')
];

const beaconType = 'crash';
const viewGroupByFilter = 'mobileBeacon.view.name';
const deviceGroupByFilter = 'mobileBeacon.device.model';
const osGroupByFilter = 'mobileBeacon.os.nameVersion';
const appVersionGroupByFilter = 'mobileBeacon.app.version';

interface CrashProp {
  location: any;
  timeConfig: TimeConfig;
  mobileAppId: string;
}

export default connectTo(({ location, timeConfig, mobileAppId }: CrashProp) => {
  const observables: Record<string, any> = {};

  const crashId = getMatrixParameter(location, '/details', 'crashId');
  observables.crashId = just(crashId);
  if (crashId) {
    observables.result = getMobileAppBeacons({
      tagFilters: [
        {
          name: 'mobileBeacon.type',
          stringValue: beaconType,
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
          name: 'mobileBeacon.crash.groupLabel',
          stringValue: crashId,
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
})(CrashTab);

interface CrashTabProp {
  crashId: string;
  result: any;
  mobileAppId: string;
  mobileAppLabel: string;
  viewId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
}

function CrashTab({ crashId, result, mobileAppId, mobileAppLabel, viewId, tagFilters, timeConfig }: CrashTabProp) {
  const tagCatalogCrash = useTagCatalog('crash');

  const tagFiltersWithCrashId = tagFilters.slice();
  tagFiltersWithCrashId.push(
    {
      name: 'mobileBeacon.type',
      stringValue: 'crash',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    },
    {
      name: 'mobileBeacon.crash.groupLabel',
      stringValue: crashId,
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    }
  );

  const occurencesAnalyzeHref = useLinkToAnalyze();

  const usersAnalyzeHref = useLinkToAnalyze();

  const analyzeCrashesHref = useLinkToAnalyze();

  const mobileAppHref = useGetLinkToMobileApp(mobileAppId, { tabPath: '/crashes', viewId });

  if (!crashId) {
    return <RedirectWithHash to={crashesTabFullyQualified} />;
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
        groupbyTag: 'mobileBeacon.crash.groupLabel'
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
              tagFilters={tagFiltersWithCrashId}
              iconAction={{
                text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href:
                  tagCatalogCrash &&
                  occurencesAnalyzeHref({
                    beaconType: 'crash',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      mobileAppLabel,
                      tagFilters: tagFiltersWithCrashId,
                      tagCatalog: tagCatalogCrash
                    }),
                    groupBy: {
                      groupbyTag: 'mobileBeacon.crash.groupLabel'
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
              tagFilters={tagFiltersWithCrashId}
              iconAction={{
                text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href:
                  tagCatalogCrash &&
                  usersAnalyzeHref({
                    beaconType: 'crash',
                    formModel: translateDemocratisationTagFiltersToFormModel({
                      mobileAppLabel,
                      tagFilters: tagFiltersWithCrashId,
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
          </Col>
        </Row>

        {firstBeacon && (
          <Row>
            <Col lg={12}>
              <Card title={t('in-mobile-apps:dashboard.tabs.crashes.crashInfoTitle')}>
                <Dl>
                  <Di title={t('in-mobile-apps:dashboard.tabs.crashes.crashInfoMessage')}>
                    {firstBeacon.errorMessage}
                  </Di>
                </Dl>
                <BeaconStack beacon={firstBeacon} optionalLabel />
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
                tagFilters: tagFiltersWithCrashId,
                metrics: {
                  beaconCount: {
                    metric: 'beaconCount',
                    granularity,
                    aggregation: 'SUM',
                    omitMetricInAnalytics: true,
                    beaconType: 'crash'
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
                tagFilters: tagFiltersWithCrashId,
                metrics: {
                  uniqueUsersOrSessions: {
                    metric: 'uniqueUsersOrSessions',
                    granularity,
                    aggregation: 'DISTINCT_COUNT',
                    beaconType: 'crash'
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
              tagFilters={tagFiltersWithCrashId}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconType}
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
                tagFilters={tagFiltersWithCrashId}
                metrics={metrics}
                labels={labels}
                aggregations={aggregations}
                formatters={formatters}
                beaconType={beaconType}
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
              tagFilters={tagFiltersWithCrashId}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconType}
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
              tagFilters={tagFiltersWithCrashId}
              metrics={metrics}
              labels={labels}
              aggregations={aggregations}
              formatters={formatters}
              beaconType={beaconType}
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
      <Title
        title={t('in-mobile-apps:dashboard.tabs.crashes.crashTitleMobileAppCrashDetails')}
        dynamic={result?.data?.message}
      />

      <div className={locals.actions}>
        <BackButton
          label={t('in-mobile-apps:dashboard.tabs.crashes.backToCrashList')}
          href={mobileAppHref}
          withoutMargin
        />

        <Button
          kind="secondary"
          href={
            tagCatalogCrash &&
            analyzeCrashesHref({
              beaconType: 'crash',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters: tagFiltersWithCrashId,
                tagCatalog: tagCatalogCrash
              }),
              groupBy: {}
            })
          }
        >
          {t('in-mobile-apps:dashboard.tabs.crashes.crashesButtonAnalyzeCrashes')}
        </Button>
      </div>

      {content}
      <Footer />
    </Fragment>
  );
}
