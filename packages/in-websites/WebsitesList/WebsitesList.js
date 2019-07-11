import React from 'react';

import WebsitesNoDataNotification from 'in-websites/WebsitesList/components/WebsitesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { websitesPath, linkToNewWebsite$ } from 'in-websites/navigation/paths';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import getWebsites from 'in-subscription/websiteMonitoring/getWebsites';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { websitesOpenAddForm } from 'in-websites/tracker';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './WebsitesList.mless';

const columnDefinitions = [
  {
    id: 'websiteLabel',
    label: 'Name',
    getContent(item) {
      return <Link href$={getLinkToWebsite(item.website.id)}>{item.website.label}</Link>;
    }
  },
  {
    id: 'pageViewsAgg',
    label: 'Page Views',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
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
    label: 'onLoad Time',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.onLoadTime}
          metric={item.metrics.onLoadTimeAgg}
          tooltipFormatter={meanLatencyFixed.compact}
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
    Add Website
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function WebsitesList({ timeConfig }) {
    return (
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Title title="Websites" />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={WebsitesNoDataNotification}
          >
            <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} rightHeader={rightHeader} />
          </WithEmptyStateFallback>
        </MaxWidthFullscreenContainer>

        <Footer />
      </Sticky>
    );
  }
);

function getTableData(params) {
  return getWebsitesSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getWebsitesSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getWebsitesSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'pageViewsAgg',
  orderDirection = 'DESC',
  timeConfig
}) {
  return getWebsites({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      pageViewsAgg: {
        metric: 'pageViews',
        aggregation: 'SUM'
      },
      pageViews: {
        metric: 'pageViews',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      onLoadTimeAgg: {
        metric: 'onLoadTime',
        aggregation: 'MEAN'
      },
      onLoadTime: {
        metric: 'onLoadTime',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    labelFilter: query,
    timeConfig
  });
}
