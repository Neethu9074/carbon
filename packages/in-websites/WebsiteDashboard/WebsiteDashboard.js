/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior';
import { websitePath, websitePathFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { websiteId as matrixWebsiteId, pageId as matrixPageId } from 'in-websites/navigation/matrix';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import WebsiteContextIcon from 'in-websites/WebsiteDashboard/components/WebsiteContextIcon';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { tagFiltersInDashboardUrlParameter } from 'in-websites/navigation/urlParameters';
import WebsiteContext from 'in-websites/WebsiteDashboard/components/WebsiteContext';
import { websiteTabs, pageTabs } from 'in-websites/WebsiteDashboard/tabs/index';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-websites/tracker';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import CreateAlert from 'in-alerting/smart-alerts/websites/CreateAlert';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { getTimeConfig } from 'in-stores/time/config';
import { tabChange } from 'in-websites/tracker';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default compose(
  withUrlState({
    bind: [
      {
        ...tagFiltersInDashboardUrlParameter,
        as: 'tagFilters'
      }
    ],
    replaceHistory: false,
    reducerName: 'onChange'
  }),
  withProps(({ onChange }) => ({
    onChange: ({ tagFilters }) => {
      // We have to pass down the website ID and page name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      onChange({
        tagFilters: tagFilters.filter(f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name')
      });
    }
  })),
  withProps(({ onChange, location }) => ({
    setTagFilters(tagFilters) {
      onChange({
        // drop the implicit tag filters
        tagFilters: tagFilters.filter(f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name')
      });
    },
    timeConfig: getTimeConfig(location)
  })),
  tagFilterManipulators({ tagFiltersTrackers })
)(WebsiteDashboard);

function WebsiteDashboard({
  location,
  tagFilters: customTagFilters,
  removeTagFilter,
  upsertTagFilter,
  clearTagFilters,
  setTagFilters,
  addTagFilter
}) {
  const props = {
    websiteId: getMatrixParameter(location, websitePath, matrixWebsiteId),
    pageId: getMatrixParameter(location, websitePath, matrixPageId),
    viewPath: websitePathFullyQualified,
    timeConfig: getTimeConfig(location),
    removeTagFilter,
    upsertTagFilter,
    clearTagFilters,
    setTagFilters,
    addTagFilter
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

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Websites',
          pageRootName: props.pageId ? 'Website Page' : 'Website'
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
      {role.canConfigureCustomAlerts && (
        <FloatingActionButtons>
          <CreateAlert
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
        renderButtonLine={renderButtonLine}
        contextConfigurations={contextConfigurations}
        tagCatalogPageLoad={tagCatalogPageLoad}
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

function renderButtonLine({ tagFilters, websiteLabel, websiteId, timeConfig, tagCatalogPageLoad }) {
  return (
    <>
      <WebsiteHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        websiteId={websiteId}
        timeConfig={timeConfig}
      />
      <Button
        kind="primary"
        icon="lib_website_page_load"
        href$={
          tagCatalogPageLoad &&
          getLinkToAnalyze({
            beaconType: 'pageLoad',
            formModel: translateDemocratisationTagFiltersToFormModel({
              websiteLabel,
              tagFilters,
              tagCatalog: tagCatalogPageLoad
            }),
            groupBy: defaultGroupings.pageLoad
          })
        }
      >
        {t('in-websites:websiteDashboard.websiteDashboardButtonAnalyzePageLoads')}
      </Button>
    </>
  );
}

function renderWebsiteContext(props) {
  return <WebsiteContext {...props} />;
}
