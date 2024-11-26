/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import MobileHealthIndicatorBehavior from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileHealthIndicatorBehavior';
import { mobileAppPath, mobileAppPathFullyQualified, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { mobileAppId as matrixMobileAppId, viewId as matrixViewId } from 'in-mobile-apps/navigation/matrix';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import MobileAppContextIcon from 'in-mobile-apps/MobileAppDashboard/components/MobileAppContextIcon';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-mobile-apps/tracking/segTracker';
import MobileAppContext from 'in-mobile-apps/MobileAppDashboard/components/MobileAppContext';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { mobileAppTabs, viewTabs } from 'in-mobile-apps/MobileAppDashboard/tabs/index';
import CreateSmartAlert from 'in-alerting/smart-alerts/mobileApp/CreateSmartAlert';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import { alertsTabListFullyQualified } from 'in-mobile-apps/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useTagFilterManipulators } from 'in-mobile-apps/tagFiltersHoc';
import { useMobileTracker } from 'in-mobile-apps/tracking/segTracker';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export const urlStateDefinition = {
  bind: [{ ...tagFiltersInDashboardUrlParameter, as: 'tagFilters' }],
  replaceHistory: false,
  reducerName: 'onChange'
};

export default function MobileAppDashboard() {
  const { tabChange } = useMobileTracker();
  const { trackCta } = useSegmentTracking();
  const location = useLocation();
  const [{ tagFilters: customTagFilters }, setUrl] = useUrlState(urlStateDefinition);

  const setUrlNew = tagFilters =>
    setUrl({
      // We have to pass down the mobile app ID and view name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      //
      // drop the implicit tag filters
      tagFilters: tagFilters.filter(f => f.name !== 'mobileBeacon.mobileApp.id' && f.name !== 'mobileBeacon.view.name')
    });

  const tagFilterManipulators = useTagFilterManipulators(tagFiltersTrackers(trackCta), customTagFilters, setUrlNew);
  const props = {
    mobileAppId: getMatrixParameter(location, mobileAppPath, matrixMobileAppId),
    viewId: getMatrixParameter(location, mobileAppPath, matrixViewId),
    viewPath: mobileAppPathFullyQualified,
    timeConfig: getTimeConfig(location),
    ...tagFilterManipulators,
    location
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

  // hide the SA floating button from the alerts listing page, as the create button is now displayed alongside the table
  const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;
  const hideButtonInTableView = displayCarbonTable ? location.pathname !== alertsTabListFullyQualified : true;

  const showAlertButton =
    role.canConfigureMobileAppSmartAlerts &&
    !location.pathname.includes('/mobileAppMonitoring/mobileApp/configuration') &&
    hideButtonInTableView;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: props.viewId ? pageNames.mobile_app_view_summary : pageNames.mobile_app_summary,
          pagePath: location?.pathname
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
      {showAlertButton && (
        <FloatingActionButtons>
          <CreateSmartAlert {...props} />
        </FloatingActionButtons>
      )}
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
        showHistoricDataWarning={false}
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

function ButtonLine({ viewId, mobileAppId, timeConfig, tagCatalogSessionStart, mobileAppLabel, tagFilters }) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  return (
    <>
      <MobileHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        mobileAppId={mobileAppId}
        timeConfig={timeConfig}
      />
      {viewId && (
        <Button
          kind={carbonButtonEnabled ? 'action' : 'primary'}
          icon="lib_mobile_app_view"
          size={carbonButtonEnabled ? 'compact' : 'normal'}
          href={
            tagCatalogSessionStart &&
            getLinkToMobileAppAnalyze({
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
          kind={carbonButtonEnabled ? 'action' : 'primary'}
          icon="lib_mobile_app_session"
          size={carbonButtonEnabled ? 'compact' : 'normal'}
          href={
            tagCatalogSessionStart &&
            getLinkToMobileAppAnalyze({
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

function renderButtonLine({ tagFilters, mobileAppId, timeConfig, mobileAppLabel, viewId, tagCatalogSessionStart }) {
  return (
    <ButtonLine
      viewId={viewId}
      mobileAppId={mobileAppId}
      timeConfig={timeConfig}
      tagCatalogSessionStart={tagCatalogSessionStart}
      mobileAppLabel={mobileAppLabel}
      tagFilters={tagFilters}
    />
  );
}
