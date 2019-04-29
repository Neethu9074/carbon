import React, { Fragment } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { websitesPath, websitesPathFullyQualified, linkToNewWebsite$ } from 'in-websites/navigation/paths';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getLinkToWebsite, newWebsitePathFullyQualified } from 'in-websites/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import getWebsites from 'in-subscription/websiteMonitoring/getWebsites';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './WebsitesList.mless';

const rightHeader = role.canConfigureEumApplications && (
  <Button kind="action" className={locals.button} icon="lib_openclose_add_circle_outline" href$={linkToNewWebsite$}>
    Add Website
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$,
    totalNumberOfWebsites: timeConfig$
      .flatMap(timeConfig =>
        getWebsites({
          timeConfig,
          pagination: {
            page: 1,
            pageSize: 1
          },
          order: {
            by: 'websiteLabel',
            direction: 'ASC'
          },
          metrics: {}
        })
      )
      .map(result => {
        if (result.data == null) {
          return null;
        }
        return result.data.totalHits;
      })
  },
  function WebsitesList({ timeConfig, totalNumberOfWebsites }) {
    if (totalNumberOfWebsites === 0) {
      return <RedirectWithHash to={newWebsitePathFullyQualified} />;
    }

    const leftHeader = <ListTitle>Websites</ListTitle>;

    return (
      <Fragment>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = websitesPathFullyQualified))}
            icon="lib_website"
            label="Websites"
            isActive
          />
        </SecondLevelNavigation>
        <TimeSelection />
        <MaxWidthFullscreenContainer>
          <Title title="Websites" />

          <ServerTableWithUrlBoundState
            get={getTableData}
            pathSegment={websitesPath}
            matrixPrefix=""
            columnDefinitions={columnDefinitions}
            timeConfig={timeConfig}
            rightHeader={rightHeader}
            leftHeader={leftHeader}
            paginationResettingProps={{ timeConfig }}
            defaultOrderBy="pageViewsAgg"
            defaultOrderDirection="DESC"
          />
        </MaxWidthFullscreenContainer>
      </Fragment>
    );
  }
);

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
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
