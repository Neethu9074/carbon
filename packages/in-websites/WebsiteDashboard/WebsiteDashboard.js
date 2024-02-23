/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import { useLinkToAnalyze, websitePath, websitePathFullyQualified } from 'in-websites/navigation/paths';
import { pageId as matrixPageId, websiteId as matrixWebsiteId } from 'in-websites/navigation/matrix';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import WebsiteContextIcon from 'in-websites/WebsiteDashboard/components/WebsiteContextIcon';
import { dashboardTagFilters as tagFiltersTrackers, tabChange } from 'in-websites/tracker';
import { tagFiltersInDashboardUrlParameter } from 'in-websites/navigation/urlParameters';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import WebsiteContext from 'in-websites/WebsiteDashboard/components/WebsiteContext';
import CreateSmartAlert from 'in-alerting/smart-alerts/websites/CreateSmartAlert';
import { pageTabs, websiteTabs } from 'in-websites/WebsiteDashboard/tabs/index';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useTagFilterManipulators } from 'in-websites/tagFiltersHoc';
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
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [{ ...tagFiltersInDashboardUrlParameter, as: 'tagFilters' }],
  replaceHistory: false,
  reducerName: 'onChange'
};

export default function WebsiteDashboard() {
  const location = useLocation();
  const [{ tagFilters: customTagFilters }, setUrl] = useUrlState(urlStateDefinition);

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

  const tagFilterManipulators = useTagFilterManipulators(tagFiltersTrackers, customTagFilters, setUrlNew);
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

  const tagFilters = (props.tagFilters = customTagFilters.concat(implicitTagFilters));

  const showAlertButton =
    role.canConfigureWebsiteSmartAlerts && !location.pathname.includes('/websiteMonitoring/website/configuration');

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
        <Button kind="primary" icon="lib_website_page_load" href={transitionsAnalyzeHref}>
          {t('in-websites:websiteDashboard.websiteDashboardButtonAnalyzePageTransitions')}
        </Button>
      )}
      {!pageId && (
        <Button kind="primary" icon="lib_website_page_load" href={loadsAnalyzeHref}>
          {t('in-websites:websiteDashboard.websiteDashboardButtonAnalyzePageLoads')}
        </Button>
      )}
    </>
  );
}

function renderWebsiteContext(props) {
  return <WebsiteContext {...props} />;
}
