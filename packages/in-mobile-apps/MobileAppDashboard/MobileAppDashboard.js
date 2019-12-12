import { compose, withProps } from 'recompose';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import { mobileAppPath, mobileAppPathFullyQualified, getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { mobileAppId as matrixMobileAppId, viewId as matrixViewId } from 'in-mobile-apps/navigation/matrix';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
import { mobileAppTabs, viewTabs } from 'in-mobile-apps/MobileAppDashboard/tabs/index';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-mobile-apps/tracker';
import MobileAppsBreadcrumb from 'in-mobile-apps/breadcrumbs/MobileAppsBreadcrumb';
import MobileAppBreadcrumb from 'in-mobile-apps/breadcrumbs/MobileAppBreadcrumb';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import ViewBreadcrumb from 'in-mobile-apps/breadcrumbs/ViewBreadcrumb';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { tagFilterManipulators } from 'in-mobile-apps/tagFiltersHoc';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { tabChange } from 'in-mobile-apps/tracker';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';

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
      // We have to pass down the mobile app ID and view name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      onChange({
        tagFilters: tagFilters.filter(
          f => f.name !== 'mobileBeacon.mobileApp.id' && f.name !== 'mobileBeacon.view.name'
        )
      });
    }
  })),
  withProps(({ onChange, location }) => ({
    setTagFilters(tagFilters) {
      onChange({
        // drop the implicit tag filters
        tagFilters: tagFilters.filter(
          f => f.name !== 'mobileBeacon.mobileApp.id' && f.name !== 'mobileBeacon.view.name'
        )
      });
    },
    timeConfig: getTimeConfig(location)
  })),
  tagFilterManipulators({ tagFiltersTrackers })
)(MobileAppDashboard);

function MobileAppDashboard({
  location,
  tagFilters: customTagFilters,
  removeTagFilter,
  upsertTagFilter,
  clearTagFilters,
  setTagFilters,
  addTagFilter
}) {
  const props = {
    mobileAppId: getMatrixParameter(location, mobileAppPath, matrixMobileAppId),
    viewId: getMatrixParameter(location, mobileAppPath, matrixViewId),
    viewPath: mobileAppPathFullyQualified,
    timeConfig: getTimeConfig(location),
    removeTagFilter,
    upsertTagFilter,
    clearTagFilters,
    setTagFilters,
    addTagFilter
  };

  const implicitTagFilters = (props.implicitTagFilters = [
    {
      name: 'mobileBeacon.mobileApp.id',
      operator: 'EQUALS',
      stringValue: props.mobileAppId
    }
  ]);
  if (props.viewId) {
    implicitTagFilters.push({
      name: 'mobileBeacon.view.name',
      operator: 'EQUALS',
      stringValue: props.viewId
    });
  }

  const tagFilters = (props.tagFilters = customTagFilters.concat(implicitTagFilters));

  return (
    <Fragment>
      <Breadcrumbs items={getBreadcrumbs(props)} />
      <Sticky header={<BreadcrumbHeader />}>
        <TabView
          result$={getMobileApp({
            id: props.mobileAppId,
            timeConfig: props.timeConfig
          })}
          HeaderComponent={Header}
          location={location}
          tabs={props.viewId ? viewTabs : mobileAppTabs}
          tabChangeTracker={tabChange}
          props={{ ...props, tagFilters, customTagFilters }}
          withoutBreadcrumb
          withProps={({ result }) => ({
            mobileAppLabel: get(result, ['data', 'label'])
          })}
        />
      </Sticky>
      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return (
    <>
      <DashboardHeader
        {...props}
        title={props.viewId ? 'View' : 'Mobile App'}
        icon="lib_website"
        label={props.viewId || get(props.result, ['data', 'label'])}
        renderButtonLine={renderButtonLine}
      />
      <DashboardHeaderModule>
        <QuickFilterBar
          {...props}
          tagFilters={props.tagFilters}
          showClearFilters={props.customTagFilters.length > 0}
          showSubdivisionSelector
        />
      </DashboardHeaderModule>
    </>
  );
}

function getBreadcrumbs(props) {
  return [
    <MobileAppsBreadcrumb />,
    <MobileAppBreadcrumb {...props} />,
    props.viewId && <ViewBreadcrumb {...props} />
  ].filter(Boolean);
}

function renderButtonLine({ tagFilters, mobileAppLabel }) {
  return (
    <Fragment>
      <Button
        kind="primary"
        icon="lib_website_page_load"
        href$={getLinkToAnalyze({
          beaconType: 'sessionStart',
          tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ mobileAppLabel, tagFilters }),
          group: defaultGroupings.sessionStart
        })}
      >
        Analyze Sessions
      </Button>
    </Fragment>
  );
}
