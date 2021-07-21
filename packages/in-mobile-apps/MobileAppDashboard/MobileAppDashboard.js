/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import { mobileAppPath, mobileAppPathFullyQualified, getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { mobileAppId as matrixMobileAppId, viewId as matrixViewId } from 'in-mobile-apps/navigation/matrix';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import MobileAppContextIcon from 'in-mobile-apps/MobileAppDashboard/components/MobileAppContextIcon';
import MobileAppContext from 'in-mobile-apps/MobileAppDashboard/components/MobileAppContext';
import { tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { mobileAppTabs, viewTabs } from 'in-mobile-apps/MobileAppDashboard/tabs/index';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-mobile-apps/tracker';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import { tagFilterManipulators } from 'in-mobile-apps/tagFiltersHoc';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { tabChange } from 'in-mobile-apps/tracker';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-components/Footer';
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
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Mobile Apps',
          pageRootName: props.viewId ? 'Mobile App View' : 'Mobile App'
        }}
      />

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
        withProps={({ result }) => ({
          mobileAppLabel: get(result, ['data', 'label'])
        })}
      />
      <Footer />
    </>
  );
}

function Header(props) {
  const tagCatalogSessionStart = useTagCatalog('sessionStart');
  const contextConfigurations = [];
  if (props.viewId) {
    contextConfigurations.push({
      renderContext: renderMobileAppContext,
      renderContextIcon: MobileAppContextIcon
    });
  }

  return (
    <>
      <DashboardHeader
        {...props}
        icon={props.viewId ? 'lib_mobile_app_view' : 'lib_mobile_app'}
        title={
          props.viewId ? t('in-mobile-apps:dashboard.mobileAppViewTitle') : t('in-mobile-apps:dashboard.mobileAppTitle')
        }
        label={props.viewId || get(props.result, ['data', 'label'])}
        renderButtonLine={renderButtonLine}
        contextConfigurations={contextConfigurations}
        tagCatalogSessionStart={tagCatalogSessionStart}
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

function renderMobileAppContext(props) {
  return <MobileAppContext {...props} />;
}

function renderButtonLine({ tagFilters, mobileAppLabel, viewId, tagCatalogSessionStart }) {
  return (
    <>
      {viewId && (
        <Button
          kind="primary"
          icon="lib_mobile_app"
          href$={
            tagCatalogSessionStart &&
            getLinkToAnalyze({
              beaconType: 'viewChange',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters,
                tagCatalog: tagCatalogSessionStart
              }),
              groupBy: defaultGroupings.viewChange
            })
          }
        >
          {t('in-mobile-apps:dashboard.analyzeViewTransitions')}
        </Button>
      )}

      {!viewId && (
        <Button
          kind="primary"
          icon="lib_mobile_app_session"
          href$={
            tagCatalogSessionStart &&
            getLinkToAnalyze({
              beaconType: 'sessionStart',
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel,
                tagFilters,
                tagCatalog: tagCatalogSessionStart
              }),
              groupBy: defaultGroupings.sessionStart
            })
          }
        >
          {t('in-mobile-apps:dashboard.analyzeSessions')}
        </Button>
      )}
    </>
  );
}
