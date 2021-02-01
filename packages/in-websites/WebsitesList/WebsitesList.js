/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import WebsitesNoDataNotification from 'in-websites/WebsitesList/components/WebsitesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import { websitesPath, linkToNewWebsite$ } from 'in-websites/navigation/paths';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { websitesOpenAddForm } from 'in-websites/tracker';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './WebsitesList.mless';

const columnDefinitions = [
  {
    id: 'websiteLabel',
    label: t('in-websites:websitesList.websitesListLabelName'),
    getContent(item) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['healthInfo', 'maxSeverity'], 0)}>
          <Link href$={getLinkToWebsite(item.website.id)}>{item.website.label}</Link>
        </SeverityIndicatorCellContentWrapper>
      );
    }
  },
  {
    id: 'pageViewsAgg',
    label: t('in-websites:websitesList.websitesListLabelPageViews'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.pageViews}
          metric={item.metrics.pageViewsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'onLoadTimeAgg',
    label: t('in-websites:websitesList.websitesListLabelOnLoadTime'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          // onLoadTime is not available when websites haven't received any loads
          metrics={item.metrics.onLoadTime || []}
          metric={item.metrics.onLoadTimeAgg}
          tooltipFormatter={meanLatencyFixed.compact}
        />
      );
    }
  },
  {
    id: 'maxSeverity',
    label: t('in-websites:websitesList.websitesListLabelHealth'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <WebsiteHealthIndicatorBehavior
          websiteId={item.website.id}
          openIssues={get(item, ['healthInfo', 'openIssues', 'length'], 0)}
          maxSeverity={get(item, ['healthInfo', 'maxSeverity'], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'pageViewsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: websitesPath
});

const rightHeader = role.canConfigureEumApplications && (
  <Button
    kind="action"
    onClick={() => websitesOpenAddForm()}
    className={locals.button}
    icon="lib_openclose_add_circle_outline"
    href$={linkToNewWebsite$}
  >
    {t('in-websites:websitesList.websitesListButtonAddWebsite')}
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function WebsitesList({ timeConfig }) {
    return (
      <Sticky header={<ViewSwitcher isWebsites />}>
        <LeftRightPadding>
          <Title title={t('in-websites:websitesList.websitesListTitleWebsites')} />
          <ViewTrackingMeta
            data={{
              productArea: t('in-websites:websitesList.websitesListProductAreaEUMWebsites'),
              pageRootName: t('in-websites:websitesList.websitesListPageRootNameWebsites')
            }}
          />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={WebsitesNoDataNotification}
          >
            <Card hasMarginBottom>
              <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} rightHeader={rightHeader} />
            </Card>
          </WithEmptyStateFallback>
        </LeftRightPadding>
        <Footer />
      </Sticky>
    );
  }
);

function getTableData(params) {
  return getWebsitesWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getWebsitesWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
