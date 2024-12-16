/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import { get } from 'lodash';

import { Button, Message, Link } from '@instana/components';

import {
  useLinkToAnalyze,
  websitePath,
  websitePathFullyQualified,
  configurationOptionsFullyQualified
} from 'in-websites/navigation/paths';
import { MessageContentModernDesign } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import { pageId as matrixPageId, websiteId as matrixWebsiteId } from 'in-websites/navigation/matrix';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import WebsiteContextIcon from 'in-websites/WebsiteDashboard/components/WebsiteContextIcon';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-websites/tracking/segTracker';
import { smartAlertCarbonTableEnabled, carbonTableEnabled } from 'in-services/featureFlags';
import { tagFiltersInDashboardUrlParameter } from 'in-websites/navigation/urlParameters';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import getJsAgentVersionsInfo from 'in-websites/subscriptions/getJsAgentVersionsInfo';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import WebsiteContext from 'in-websites/WebsiteDashboard/components/WebsiteContext';
import { toTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import CreateSmartAlert from 'in-alerting/smart-alerts/websites/CreateSmartAlert';
import { pageTabs, websiteTabs } from 'in-websites/WebsiteDashboard/tabs/index';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { alertsTabListFullyQualified } from 'in-websites/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useTagFilterManipulators } from 'in-websites/tagFiltersHoc';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import DashboardHeader from 'in-components/DashboardHeader';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from 'in-websites/WebsiteDashboard/Warning.mless';

export const urlStateDefinition = {
  bind: [{ ...tagFiltersInDashboardUrlParameter, as: 'tagFilters' }],
  replaceHistory: false,
  reducerName: 'onChange'
};

const deprecationTimeFrame = 1728000000;

export default function WebsiteDashboard() {
  const { trackCta } = useSegmentTracking();
  const { tabChange } = useWebsiteTracker();
  const [weaselVersion, setWeaselVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [deprecatedVersion, setDeprecatedVersion] = useState([]);
  const { createHrefToPath } = useNavigation();

  const location = useLocation();
  const [{ tagFilters: customTagFilters }, setUrl] = useUrlState(urlStateDefinition);

  let deprecationDate = '';
  let setDeprecated = false;
  const setUrlNew = tagFilters =>
    setUrl({
      // We have to pass down the website ID and page name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      //
      // drop the implicit tag filters
      tagFilters: tagFilters.filter(f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name')
    });

  const tagFilterManipulators = useTagFilterManipulators(tagFiltersTrackers(trackCta), customTagFilters, setUrlNew);
  const props = {
    websiteId: getMatrixParameter(location, websitePath, matrixWebsiteId),
    pageId: getMatrixParameter(location, websitePath, matrixPageId),
    viewPath: websitePathFullyQualified,
    timeConfig: getTimeConfig(location),
    ...tagFilterManipulators
  };

  const implicitTagFilters = (props.implicitTagFilters = [
    {
      name: 'beacon.website.id',
      operator: 'EQUALS',
      stringValue: props.websiteId
    }
  ]);
  if (props.pageId) {
    implicitTagFilters.push({
      name: 'beacon.page.name',
      operator: 'EQUALS',
      stringValue: props.pageId
    });
  }

  const toTagFilterExpression = toTagFilter({
    name: 'beacon.website.id',
    operator: 'EQUALS',
    entity: 'NOT_APPLICABLE',
    type: 'TAG_FILTER',
    value: props.websiteId
  });

  useMemo(
    () => getBeaconGroupInfo(toTagFilterExpression, setWeaselVersion, setLatestVersion, setDeprecatedVersion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const retainDate = deprecatedVersion?.filter(item => item.version == weaselVersion)?.map(ret => ret.retainUntil);

  if (retainDate?.[0] - Date.now() <= deprecationTimeFrame) {
    setDeprecated = true;
    deprecationDate = new Date(retainDate?.[0]).toLocaleDateString();
  }

  const setWarn = latestVersion.localeCompare(weaselVersion);

  const tagFilters = (props.tagFilters = customTagFilters.concat(implicitTagFilters));

  // hide the SA floating button from the alerts listing page, as the create button is now displayed alongside the table
  const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;
  const hideButtonInTableView = displayCarbonTable ? location.pathname !== alertsTabListFullyQualified : true;

  const showAlertButton =
    role.canConfigureWebsiteSmartAlerts &&
    !location.pathname.includes('/websiteMonitoring/website/configuration') &&
    hideButtonInTableView;

  const versionValues = {
    currentVersion: weaselVersion,
    latestVersion: latestVersion,
    ...(setDeprecated && { deprecationDate: deprecationDate })
  };

  const messageType = setDeprecated ? 'error' : 'warning';

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: props.pageId ? pageNames.website_summary : pageNames.website,
          pagePath: location?.pathname
        }}
      />

      <TabView
        result$={getWebsite({
          id: props.websiteId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={props.pageId ? pageTabs : websiteTabs}
        tabChangeTracker={tabChange}
        props={{ ...props, tagFilters, customTagFilters }}
        withoutBreadcrumb
        withProps={({ result }) => ({
          websiteLabel: get(result, ['data', 'label'])
        })}
        warnMessage={
          <>
            {(setDeprecated || setWarn === 1) &&
              getWarningMessage(messageType, setDeprecated, versionValues, createHrefToPath)}
          </>
        }
      />
      {showAlertButton && (
        <FloatingActionButtons>
          <CreateSmartAlert
            websiteId={props.websiteId}
            tagFilters={tagFilters}
            websiteResult$={getWebsite({
              id: props.websiteId,
              timeConfig: props.timeConfig
            })}
            timeConfig={props.timeConfig}
            location={location}
          />
        </FloatingActionButtons>
      )}
    </>
  );
}

function Header(props) {
  const tagCatalogPageLoad = useTagCatalog('pageLoad');
  const contextConfigurations = [];
  if (props.pageId) {
    contextConfigurations.push({
      renderContext: renderWebsiteContext,
      renderContextIcon: WebsiteContextIcon
    });
  }

  return (
    <>
      <DashboardHeader
        {...props}
        icon={props.pageId ? 'lib_document' : 'lib_website'}
        label={props.pageId || (props.result.data && props.result.data.label)}
        title={
          props.pageId
            ? t('in-websites:websiteDashboard.websiteDashboardTitleWebsitePage')
            : t('in-websites:websiteDashboard.websiteDashboardTitleWebsite')
        }
        renderButtonLine={ButtonLine}
        contextConfigurations={contextConfigurations}
        tagCatalogPageLoad={tagCatalogPageLoad}
        showHistoricDataWarning={false}
      />
      <DashboardHeaderModule>
        <QuickFilterBar
          {...props}
          tagFilters={props.tagFilters}
          showClearFilters={props.customTagFilters.length > 0}
          showSubdivisionSelector
          showWindowWidthSelector
        />
      </DashboardHeaderModule>
    </>
  );
}

function ButtonLine({ tagFilters, websiteLabel, websiteId, pageId, timeConfig, tagCatalogPageLoad }) {
  const transitionsAnalyzeHref = useLinkToAnalyze(
    tagCatalogPageLoad && {
      beaconType: 'pageChange',
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogPageLoad
      }),
      groupBy: defaultGroupings.pageLoad
    }
  );

  const loadsAnalyzeHref = useLinkToAnalyze(
    tagCatalogPageLoad && {
      beaconType: 'pageLoad',
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogPageLoad
      }),
      groupBy: defaultGroupings.pageLoad
    }
  );
  return (
    <>
      <WebsiteHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        websiteId={websiteId}
        timeConfig={timeConfig}
      />
      {pageId && (
        <Button size="compact" kind="action" icon="lib_website_page_load" href={transitionsAnalyzeHref}>
          {t('in-websites:websiteDashboard.websiteDashboardButtonAnalyzePageTransitions')}
        </Button>
      )}
      {!pageId && (
        <Button size="compact" kind="action" icon="lib_website_page_load" href={loadsAnalyzeHref}>
          {t('in-websites:websiteDashboard.websiteDashboardButtonAnalyzePageLoads')}
        </Button>
      )}
    </>
  );
}

function renderWebsiteContext(props) {
  return <WebsiteContext {...props} />;
}

function getWarningMessage(messageType, setDeprecated, versionValues, createHrefToPath) {
  if (setDeprecated) {
    return (
      <Message className={locals.message} type={messageType} fullInlineWidth dismissible>
        <MessageContentModernDesign>
          <Trans
            i18nKey={'in-websites:websiteDashboard.websiteDashboardWarnDeprecatedAgentVersion'}
            components={{ configTab: <Link href={createHrefToPath(configurationOptionsFullyQualified)} /> }}
            values={versionValues}
          />
        </MessageContentModernDesign>
      </Message>
    );
  }

  return (
    <Message className={locals.message} type={messageType} fullInlineWidth dismissible>
      <MessageContentModernDesign>
        <Trans
          i18nKey={'in-websites:websiteDashboard.websiteDashboardWarnOldAgentVersion'}
          components={{ configTab: <Link href={createHrefToPath(configurationOptionsFullyQualified)} /> }}
          values={versionValues}
        />
      </MessageContentModernDesign>
    </Message>
  );
}

const getBeaconGroupInfo = (toTagFilterExpression, setWeaselVersion, setLatestVersion, setDeprecatedVersion) => {
  getWebsiteBeaconGroups({
    timeConfig: {
      windowSize: 86400000
    },
    pagination: {
      retrievalSize: 1
    },
    tagFilterExpression: toTagFilterExpression,
    metrics: {
      beaconCount: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    },
    type: 'PAGELOAD',
    order: {
      by: 'name',
      direction: 'DESC'
    },
    group: {
      groupbyTag: 'beacon.agentVersion',
      tagType: 'STRING'
    }
  }).subscribe(r => {
    setWeaselVersion(r.data?.items?.[0]?.name.replace(/"/g, ''));
    getJsAgentVersionsInfo().subscribe(r => {
      const response = r.data;
      setLatestVersion(
        response?.weasel
          ?.filter(latest => latest.tag === 'latest')
          .map(ver => ver.version)
          .toString() || ''
      );
      setDeprecatedVersion(response?.weasel?.filter(retainTag => retainTag?.retainUntil != null));
    });
  });
};
