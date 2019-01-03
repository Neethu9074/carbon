import { compose, withProps } from 'recompose';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  tagFilters as tagFiltersMatrixParameter,
  serializeTagFilters,
  deserializeTagFilters,
  websiteId as matrixWebsiteId,
  pageId as matrixPageId
} from 'in-websites/navigation/matrix';
import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { websitePath, websitePathFullyQualified, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { quickTagFiltersInWebsiteMonitoringDashboardEnabled } from 'in-services/featureFlags';
import StickyQuickFilterBar from 'in-websites/analyze/AnalyzeView/StickyQuickFilterBar';
import { websiteTabs, pageTabs } from 'in-websites/WebsiteDashboard/tabs/index';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import WebsitesBreadcrumb from 'in-websites/breadcrumbs/WebsitesBreadcrumb';
import WebsiteBreadcrumb from 'in-websites/breadcrumbs/WebsiteBreadcrumb';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import getWebsite from 'in-subscription/websiteMonitoring/getWebsite';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import PageBreadcrumb from 'in-websites/breadcrumbs/PageBreadcrumb';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { isFeatureFlagEnabled } from 'in-services/config';
import { getTimeConfig } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => websitePath,
    getMatrixPrefix: () => '',
    boundKeys: [tagFiltersMatrixParameter],
    getInitialState: () => ({
      [tagFiltersMatrixParameter]: []
    }),
    reducerName: 'onChange',
    getParsedUrlValues: props => ({
      [tagFiltersMatrixParameter]: deserializeTagFilters(props[tagFiltersMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [tagFiltersMatrixParameter]: serializeTagFilters(props[tagFiltersMatrixParameter])
    })
  }),
  withProps(({ onChange }) => ({
    onChange: ({ [tagFiltersMatrixParameter]: tagFilters }) => {
      // We have to pass down the website ID and page name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      onChange({
        [tagFiltersMatrixParameter]: tagFilters.filter(
          f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name'
        )
      });
    }
  })),
  withProps(({ onChange, location }) => ({
    setTagFilters(tagFilters) {
      onChange({
        // drop the implicit tag filters
        [tagFiltersMatrixParameter]: tagFilters.filter(
          f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name'
        )
      });
    },
    timeConfig: getTimeConfig(location)
  })),
  tagFilterManipulators
)(WebsiteDashboard);

function WebsiteDashboard({
  location,
  [tagFiltersMatrixParameter]: customTagFilters,
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

  const tabView = (
    <TabView
      result$={getWebsite({
        id: props.websiteId,
        timeConfig: props.timeConfig
      })}
      HeaderComponent={Header}
      location={location}
      tabs={props.pageId ? pageTabs : websiteTabs}
      props={props}
      withoutBreadcrumb
      withProps={({ result }) => ({
        websiteLabel: get(result, ['data', 'label'])
      })}
    />
  );

  let content = tabView;
  if (quickTagFiltersInWebsiteMonitoringDashboardEnabled) {
    content = (
      <StickyQuickFilterBar
        {...props}
        tagFilters={tagFilters}
        showClearFilters={customTagFilters.length > 0}
        showInternalOnlyMarker={!isFeatureFlagEnabled('quickTagFiltersInWebsiteMonitoringDashboardEnabled')}
      >
        {tabView}
      </StickyQuickFilterBar>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs items={getBreadcrumbs(props)} />
      <Sticky header={<BreadcrumbHeader />}>{content}</Sticky>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title={props.pageId ? 'Page' : 'Website'}
      icon="lib_website"
      renderActions={Actions}
      getLabel={getLabel}
      {...props}
    />
  );
}

function getLabel(result, { pageId }) {
  return pageId || result.data.label;
}

function getBreadcrumbs(props) {
  return [
    <WebsitesBreadcrumb />,
    <WebsiteBreadcrumb {...props} />,
    props.pageId && <PageBreadcrumb {...props} />
  ].filter(Boolean);
}

function Actions({ tagFilters, websiteLabel }) {
  return (
    <Button
      kind="primary"
      icon="lib_website_page_load"
      href$={getLinkToAnalyze({
        beaconType: 'pageLoad',
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group: defaultGroupings.pageLoad
      })}
    >
      Analyze Page Loads
    </Button>
  );
}
