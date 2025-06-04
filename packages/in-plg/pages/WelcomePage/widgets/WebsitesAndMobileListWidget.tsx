/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { TimeConfig, EntityHealthInfo } from '@instana/types';
import { Stack, Link, IconButton } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import MobileHealthIndicatorBehavior from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileHealthIndicatorBehavior';
//@ts-expect-error doesn't contain type file
import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
//@ts-expect-error doesn't contain type file
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import {
  mobileApp as mobileAppType,
  website as websiteType
} from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
//@ts-expect-error doesn't contain type file
import mergeResults from 'in-plg/pages/WelcomePage/widgets/utils/mergeResults';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
import { mobileAppMonitoringPath, useGenerateLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { useGenerateLinkToWebsite, websiteMonitoringPath } from 'in-websites/navigation/paths';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';
import { hasMobileAppsAccess, hasWebsitesAccess } from 'in-stores/permission';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { getWebsitesWithDefaults } from 'in-plg/subscriptions/getWebsites';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { meanLatencyFixed, number } from 'in-services/formatters/number';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { hasError, isLoading } from 'in-services/util/result';
import { role } from 'in-stores/user';

type WebsiteItem = {
  isWebsite: true;
  website: {
    id: string;
    label: string;
  };
};

type MobileAppItem = {
  isWebsite: false;
  mobileApp: {
    id: string;
    label: string;
  };
};

type Item = WebsiteItem | MobileAppItem;

function handleFavoriteClick(
  id: string,
  item: Item,
  isFavourite: boolean,
  setCurrentFavoriteWebsiteIds: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentFavoriteMobileIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (!id && !item) return;
  if (isFavourite) {
    remove({
      id: id,
      type: item.isWebsite ? websiteType : mobileAppType
    });
    const setFavorite = item.isWebsite ? setCurrentFavoriteWebsiteIds : setCurrentFavoriteMobileIds;
    setFavorite(prevIds => prevIds.filter(favId => favId !== id));
  } else {
    add({
      id: item.isWebsite ? item.website.id : item.mobileApp.id,
      label: item.isWebsite ? item.website.label : item.mobileApp.label,
      type: item.isWebsite ? websiteType : mobileAppType
    });
  }
}

function MobileAppHealthInfo({ mobileAppId, timeConfig }: { mobileAppId: string; timeConfig: TimeConfig }) {
  return (
    <MobileHealthIndicatorBehavior
      mobileAppId={mobileAppId}
      timeConfig={timeConfig}
      render={(healthInfo: EntityHealthInfo) =>
        healthInfo ? <HealthIcon severity={healthInfo.maxSeverity} iconSize="xs" /> : null
      }
    />
  );
}

function WebsiteHealthInfo({ websiteId, timeConfig }: { websiteId: string; timeConfig: TimeConfig }) {
  return (
    <WebsiteHealthIndicatorBehavior
      websiteId={websiteId}
      timeConfig={timeConfig}
      render={(healthInfo: EntityHealthInfo) =>
        healthInfo ? <HealthIcon severity={healthInfo.maxSeverity} iconSize="xs" /> : null
      }
    />
  );
}

function getId(item: Item) {
  return item.isWebsite ? item.website.id : item.mobileApp.id;
}

function sort(a: any, b: any) {
  const mainKpiA = a.isWebsite
    ? get(a, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(a, ['metrics', 'sessionsAgg', 0, 1], 0);
  const mainKpiB = b.isWebsite
    ? get(b, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(b, ['metrics', 'sessionsAgg', 0, 1], 0);
  return mainKpiB - mainKpiA;
}

interface Params {
  timeConfig: TimeConfig;
  query: string;
}

function getWebsites(params: Params) {
  return mergeResults([getWebsitesWithDefaults(params), 'isWebsite'])(sort);
}

function getMobileApps(params: Params) {
  return mergeResults([getMobileAppsWithDefaults(params), 'isMobileApp'])(sort);
}

interface Props {
  config: any;
  timeConfig: TimeConfig;
  type: string;
  widgetLabel: string;
  dashboardTileProps: DashboardTileParamProps;
}

export default function WebsitesAndMobileListWidget({ type, config, widgetLabel, dashboardTileProps }: Props) {
  const { createHrefToPath, goToPath } = useNavigation();
  const getLinkToWebsite = useGenerateLinkToWebsite();
  const getLinkToMobileApp = useGenerateLinkToMobileApp();
  const [currentFavoriteWebsiteIds, setCurrentFavoriteWebsiteIds] = useState<string[]>([]);
  const [currentFavoriteMobileIds, setCurrentFavoriteMobileIds] = useState<string[]>([]);

  const getHeaders = () => {
    if (type === 'website') {
      return [
        {
          header: t('in-plg:welcomepage.component.websitesWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.websitesWidget.pageViews'),
          key: 'pageViews'
        },
        {
          header: t('in-plg:welcomepage.component.websitesWidget.onLoadTimes'),
          key: 'onLoadTimes'
        },
        {
          header: t('in-plg:welcomepage.component.websitesWidget.health'),
          key: 'health'
        },
        {
          key: 'favourite',
          header: ''
        }
      ];
    } else {
      return [
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.sessions'),
          key: 'sessions'
        },
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.views'),
          key: 'views'
        },
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.health'),
          key: 'health'
        },
        {
          key: 'favourite',
          header: ''
        }
      ];
    }
  };

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        const { isWebsite } = item;
        const link = isWebsite ? getLinkToWebsite(getId(item)) : getLinkToMobileApp(getId(item));
        const content = isWebsite ? item?.website?.label : item?.mobileApp?.label;
        return <Link href={link}>{content}</Link>;
      }
    },
    {
      key: type === 'website' ? 'pageViews' : 'sessions',
      getContent({ item, result, timeConfig }) {
        const { isWebsite, metrics } = item;
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            aggregation="SUM"
            metrics={isWebsite ? metrics.pageViews : metrics.sessions}
            metric={isWebsite ? metrics.pageViewsAgg : metrics.sessionsAgg}
            tooltipFormatter={number.compact}
            showNullValuesChartOnEmptyMetrics
          />
        );
      }
    },
    {
      key: type === 'website' ? 'onLoadTimes' : 'views',
      getContent({ item, result, timeConfig }) {
        const { isWebsite, metrics } = item;
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            aggregation={isWebsite ? 'MEAN' : 'SUM'}
            metrics={isWebsite ? metrics.onLoadTime : metrics.views}
            metric={isWebsite ? metrics.onLoadTimeAgg : metrics.viewsAgg}
            tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
            showDashOnMissingOrNullMetric
            hideChartOnEmptyMetrics
          />
        );
      }
    },
    {
      key: 'health',
      getContent({ item, timeConfig }) {
        return (
          <Stack direction="horizontal" align="center">
            {item?.isWebsite ? (
              <WebsiteHealthInfo websiteId={getId(item)} timeConfig={timeConfig} />
            ) : (
              <MobileAppHealthInfo mobileAppId={getId(item)} timeConfig={timeConfig} />
            )}
          </Stack>
        );
      }
    },
    {
      key: 'favourite',
      getContent({ id, item, isDisabled = false, isFavourite = false }) {
        return (
          <IconButton
            aria-label={
              isFavourite
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : item?.pinned
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : t('in-plg:welcomepage.favouriteButton.aria')
            }
            type={
              isFavourite
                ? 'lib_actions_favorite_filled'
                : item?.pinned
                ? 'lib_actions_favorite_filled'
                : 'lib_actions_favorite'
            }
            onClick={() =>
              handleFavoriteClick(id, item, isFavourite, setCurrentFavoriteWebsiteIds, setCurrentFavoriteMobileIds)
            }
            iconSize="xs"
            disabled={isDisabled}
          />
        );
      }
    }
  ];

  const generalProps = {
    ...config,
    columnDefinitions,
    headers: getHeaders()
  };

  function addNewWebsite() {
    goToPath('/websiteMonitoring/new');
  }

  function addNewMobileApp() {
    goToPath('/mobileAppMonitoring/new');
  }

  function getMobileAppById(id: string, timeConfig: TimeConfig) {
    const granularity = getSparkChartGranularity(timeConfig);

    return combineLatest([
      getMobileApp({ id }),
      getMobileAppMetrics({
        timeConfig: timeConfig,
        timeShift: { offset: 0 },
        tagFilterExpression: tagFilter('mobileBeacon.mobileApp.id', EQUALS, id),
        metrics: {
          sessionsAgg: {
            metric: 'sessions',
            aggregation: 'SUM'
          },
          sessions: {
            metric: 'sessions',
            aggregation: 'SUM',
            granularity
          },
          viewsAgg: {
            metric: 'views',
            aggregation: 'SUM'
          },
          views: {
            metric: 'views',
            aggregation: 'SUM',
            granularity
          }
        }
      })
    ]).map(([mobileAppResult, metricResult]) => {
      const mobileId = mobileAppResult?.data?.id;
      if (mobileId && !currentFavoriteMobileIds.includes(mobileId)) {
        setCurrentFavoriteMobileIds(prevList => [...prevList, mobileId]);
      }
      return combineResults(mobileAppResult, metricResult, 'mobileApp', 'isMobileApp');
    });
  }

  function getWebsiteById(id: string, timeConfig: TimeConfig) {
    const granularity = getSparkChartGranularity(timeConfig);
    return combineLatest([
      getWebsite({ id }),
      getWebsiteMetrics({
        timeConfig,
        tagFilters: [{ name: 'beacon.website.id', operator: 'EQUALS', stringValue: id }],
        metrics: {
          pageViewsAgg: {
            metric: 'pageViews',
            aggregation: 'SUM'
          },
          pageViews: {
            metric: 'pageViews',
            aggregation: 'SUM',
            granularity
          },
          onLoadTimeAgg: {
            metric: 'onLoadTime',
            aggregation: 'MEAN'
          },
          onLoadTime: {
            metric: 'onLoadTime',
            aggregation: 'MEAN',
            granularity
          }
        }
      })
    ]).map(([websiteResult, metricResult]) => {
      const websiteId = websiteResult?.data?.id;
      if (websiteId && !currentFavoriteWebsiteIds.includes(websiteId)) {
        setCurrentFavoriteWebsiteIds(prevList => [...prevList, websiteId]);
      }
      return combineResults(websiteResult, metricResult, 'website', 'isWebsite');
    });
  }

  function combineResults(entityResult: any, metricResult: any, entityName: string, flag: string) {
    if (isLoading(entityResult) || hasError(entityResult)) {
      return entityResult;
    }
    if (isLoading(metricResult) || hasError(metricResult)) {
      return metricResult;
    }

    const mappedResult: any = {
      metrics: { ...metricResult.data },
      time: metricResult.time
    };
    mappedResult.mainKpiValue = get(
      metricResult.data,
      ['pageViewsAgg', 0, 1],
      get(metricResult.data, ['sessionsAgg', 0, 1], 0)
    );
    mappedResult[entityName] = entityResult.data;
    mappedResult[flag] = true;
    return mappedResult;
  }

  if (type === 'website') {
    return (
      <DatatableWrapper
        {...generalProps}
        nonDeletedFavoriteCount={currentFavoriteWebsiteIds.length}
        getItems={getWebsites}
        getItem={getWebsiteById}
        tableType="websitesWidget"
        viewAll
        //@ts-expect-error canConfigureEumApplications type is not available in role definition
        hasAddPermission={hasWebsitesAccess && role?.canConfigureEumApplications}
        //@ts-expect-error canConfigureEumApplications type is not available in role definition
        hasAddMore={hasWebsitesAccess && role?.canConfigureEumApplications}
        addMore={addNewWebsite}
        addData={addNewWebsite}
        href={createHrefToPath(websiteMonitoringPath)}
        label={widgetLabel}
        pinnedItemTypes={[websiteType]}
        dashboardTileProps={dashboardTileProps}
        searchPlaceholderLabel={t('in-plg:welcomepage.component.websitesWidget.searchPlaceholderLabel')}
        addButtonLabel={t('in-plg:welcomepage.component.websitesWidget.addButtonLabel')}
        viewAllLabel={t('in-plg:welcomepage.component.websitesWidget.viewAllLabel')}
      />
    );
  }
  return (
    <DatatableWrapper
      {...generalProps}
      nonDeletedFavoriteCount={currentFavoriteMobileIds.length}
      getItems={getMobileApps}
      getItem={getMobileAppById}
      tableType="mobileListWidget"
      viewAll
      hasAddPermission={hasMobileAppsAccess && role?.canConfigureMobileAppMonitoring}
      hasAddMore={hasMobileAppsAccess && role?.canConfigureMobileAppMonitoring}
      addMore={addNewMobileApp}
      addData={addNewMobileApp}
      href={createHrefToPath(mobileAppMonitoringPath)}
      label={widgetLabel}
      pinnedItemTypes={[mobileAppType]}
      dashboardTileProps={dashboardTileProps}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.mobileAppsWidget.searchPlaceholderLabel')}
      addButtonLabel={t('in-plg:welcomepage.component.mobileAppsWidget.addButtonLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.mobileAppsWidget.viewAllLabel')}
    />
  );
}
