/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { SeverityIndicatorCellContentWrapper } from '@instana/legacy';
import { Link, Card, Button } from '@instana/components';

import {
  getTimeConfigAlignedToResultTime,
  timeConfig$,
  urlParameters as timeConfigUrlParameters
} from 'in-stores/time/config';
import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import WebsitesNoDataNotification from 'in-websites/WebsitesList/components/WebsitesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { useLinkToNewWebsite, useLinkToWebsite, websitesPath } from 'in-websites/navigation/paths';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { meanLatencyFixed, number } from 'in-services/formatters/number';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { playwithEnabled } from 'in-services/featureFlags';
import { pageNames } from 'in-services/tracking/pageNames';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './WebsitesList.mless';

function WebsiteLabelColumn({ item }) {
  const websiteHref = useLinkToWebsite(item.website.id);

  return (
    <SeverityIndicatorCellContentWrapper severity={get(item, ['healthInfo', 'maxSeverity'], 0)}>
      <Link href={websiteHref}>{item.website.label}</Link>
    </SeverityIndicatorCellContentWrapper>
  );
}

const columnDefinitions = [
  {
    id: 'websiteLabel',
    label: t('in-websites:websitesList.websitesListLabelName'),
    getContent(item) {
      return <WebsiteLabelColumn item={item} />;
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
    sortable: false,
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

const RightHeader = () => {
  const { websiteOpenAddFrom } = useWebsiteTracker();
  const linkToNewWebsite = useLinkToNewWebsite();
  if (role.canConfigureEumApplications && !playwithEnabled) {
    return (
      <Button
        kind="action"
        onClick={() => websiteOpenAddFrom()}
        className={locals.button}
        icon="lib_openclose_add_circle_outline"
        href={linkToNewWebsite}
      >
        {t('in-websites:websitesList.websitesListButtonAddWebsite')}
      </Button>
    );
  }
};

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
              productArea: productAreas.websites_mobile_apps,
              pageRootName: pageNames.websites
            }}
          />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={WebsitesNoDataNotification}
          >
            <Card hasMarginBottom>
              <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} rightHeader={RightHeader} />
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
