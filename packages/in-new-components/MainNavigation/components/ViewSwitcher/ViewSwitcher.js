import classNames from 'classnames';
import React from 'react';

import {
  mobileAppMonitoringPath,
  getLinkToAnalyze as getLinkToMobileAppAnalyze,
  isAnalyzeView as isMobileAppAnalyzeView
} from 'in-mobile-apps/navigation/paths';
import {
  websiteMonitoringPath,
  getLinkToAnalyze as getLinkToWebsiteAnalyze,
  isAnalyzeView as isWebsiteAnalyzeView
} from 'in-websites/navigation/paths';
import {
  hasApplicationsAccess,
  hasWebsitesAccess,
  hasKubernetesAccess,
  hasAnalyzeAccess,
  hasMobileAppsAccess
} from 'in-stores/permission';
import {
  applicationListFullyQualified as cloudfoundryApplicationList,
  cloudfoundry
} from 'in-cloudfoundry/navigation/paths';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { pcfEnabled, vsphereEnabled, releaseNotesEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-new-components/Profiling/navigation/paths';
import { physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SubViewItem } from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import { getView, isView, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { isAnalyzeView as isLogsAnalyzeView } from 'in-logging/navigation/paths';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { agentsPath, settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { getLinkToAnalyze, isAnalyzeView } from 'in-analyze/navigation/paths';
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import AboutInstanaDialog from 'in-new-components/AboutInstanaDialog';
import { cockpit as cockpitPath } from 'in-cockpit/navigation/paths';
import Stan from 'in-new-components/MainNavigation/components/Stan';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { eventsPath } from 'in-events/navigation/paths';
import { getColorBySeverity } from 'in-stores/events';
import { all, any } from 'in-services/fixedStreams';
import { user, role } from 'in-stores/user';
import { config } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

export default function ViewSwitcher({
  isExpanded,
  expandedSubMenu,
  setExpandedSubMenu,
  onViewSwitched,
  onMouseEnter,
  onMouseLeave
}) {
  const commonProps = {
    sidebarIsExpanded: isExpanded,
    onClick: onViewSwitched,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  };

  return (
    <ul className={locals.list}>
      <View
        id="main-nav-system-overview"
        renderContent={() => <Stan />}
        isActive$={any(isView(cockpitPath), isView(customDashboardsPath))}
        // Go to default landing page when clicking this button
        href$={getView('/')}
        {...commonProps}
      />
      <Spacer />
      <WebsiteMobileAppView {...commonProps} />
      <Applications {...commonProps} />
      <Platforms
        {...commonProps}
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        sidebarIsExpanded={isExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <Infrastructure {...commonProps} />
      <Spacer />
      <Analyze {...commonProps} />
      <Incidents {...commonProps} />
      <Spacer />
      <View
        id="main-nav-settings"
        label="Settings"
        icon="lib_actions_settings_inverted"
        isActive$={isView(settingsPath)}
        href$={getView(settingsPath)}
        {...commonProps}
      />
      <InternalView sidebarIsExpanded={isExpanded} onClick={onViewSwitched} onMouseLeave={onMouseLeave} />
      <View
        id="main-nav-more"
        label="More"
        icon="lib_menu_additional_resources"
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        isActive$={any(isView(agentsPath))}
        sidebarIsExpanded={isExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {tenantSwitcherEnabled && (
          <SubViewItem label="Tenants" href={tenantSwitcherLink} external id="main-nav-tenants" />
        )}
        {role.canConfigureAgents && (
          <SubViewItem
            label="Agents"
            href$={getView(agentsPath)}
            isActive$={isView(agentsPath)}
            onClick={onViewSwitched}
            id="main-nav-agents"
          />
        )}
        {releaseNotesEnabled && (
          <SubViewItem
            label="Release Notes"
            onClick={e => {
              showReleaseNotes();
              onViewSwitched(e, 'Release Notes');
            }}
            id="main-nav-release-notes"
          />
        )}
        <SubViewItem label="Documentation" href="https://docs.instana.com" external id="main-nav-documentation" />
        <SubViewItem
          label="Support"
          className={locals.linkElement}
          href="https://support.instana.com"
          external
          id="main-nav-support"
        />
        <SubViewItem
          label="About Instana"
          onClick={e => {
            addActiveDialog(<AboutInstanaDialog />);
            onViewSwitched(e, 'About Instana');
          }}
          id="main-nav-about"
        />
        <SignOut />
      </View>
    </ul>
  );
}

const InternalView = connectTo({ isInternalVisible: isInternalVisible$ }, function({
  isInternalVisible,
  sidebarIsExpanded,
  onClick,
  onMouseLeave
}) {
  if (!isInternalVisible) {
    return null;
  }

  return (
    <View
      label="Internal"
      icon="lib_actions_lock"
      isActive$={isView('/internal')}
      href$={getModifiedUrlStream(p => (p.pathname = '/internal'))}
      sidebarIsExpanded={sidebarIsExpanded}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    />
  );
});

const Incidents = connectTo(
  {
    events: openEventsAtServerTime$,
    isActive: isView(eventsPath)
  },
  function Incidents({ events, isActive, sidebarIsExpanded, onClick, onMouseEnter, onMouseLeave }) {
    const numIncidents = events ? events.get('incidentCount') : 0;
    const maxSeverity = events ? events.get('maxIncidentSeverity') : 0;

    let color = null;
    if (numIncidents > 0) {
      color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#6B8088';
    }

    return (
      <div className={locals.incidentMenu}>
        <View
          id="main-nav-events"
          label="Events"
          icon="lib_events_inverted"
          href$={getEventsViewFilteredBy({ eventTypeFilter: 'incident' })}
          isActive={isActive}
          sidebarIsExpanded={sidebarIsExpanded}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {numIncidents > 0 && (
          <div
            className={numIncidents > 99 ? locals.issueIndicatorSmall : locals.issueIndicator}
            style={{ background: color }}
          >
            {numIncidents}
          </div>
        )}
      </div>
    );
  }
);

function SignOut() {
  return (
    <form action="/auth/signOut" method="post">
      <SubViewItem
        renderLabel={className => (
          <button className={classNames(locals.signOutButton, className)} type="submit">
            Sign Out
            <span className={locals.userEmail}>{user.email}</span>
          </button>
        )}
      />
    </form>
  );
}

function Infrastructure(props) {
  return (
    <View
      id="main-nav-infrastructure"
      label="Infrastructure"
      icon="lib_infrastructure_inverted"
      isActive$={any(isView(physicalPath), isView(containerPath), isTableView('physical'))}
      href$={getView(physicalPath)}
      {...props}
    />
  );
}

function Applications(props) {
  if (!hasApplicationsAccess) {
    return null;
  }

  return (
    <View
      id="main-nav-application"
      label="Applications"
      icon="lib_application_invert"
      isActive$={isView(isApplicationsView)}
      href$={getView(applicationsList)}
      {...props}
    />
  );
}

function Analyze(props) {
  if (!hasAnalyzeAccess) {
    return null;
  }

  return (
    <View
      id="main-nav-analyze"
      label="Analytics"
      icon="lib_analyze_inverted"
      isActive$={any(
        isView(isAnalyzeView),
        isWebsiteAnalyzeView,
        isMobileAppAnalyzeView,
        isProfileAnalyzeView,
        isLogsAnalyzeView
      )}
      href$={
        [
          hasApplicationsAccess &&
            getLinkToAnalyze({
              dataSource: 'calls',
              groupByTag: getConfigByDataSource('calls').defaultGrouping
            }),
          hasWebsitesAccess &&
            getLinkToWebsiteAnalyze({
              beaconType: 'pageLoad',
              group: defaultWebsiteGroupings.pageLoad
            }),
          hasMobileAppsAccess &&
            getLinkToMobileAppAnalyze({
              beaconType: 'sessions',
              group: defaultMobileAppGroupings.sessions
            })
        ].filter(Boolean)[0]
      }
      {...props}
    />
  );
}

function WebsiteMobileAppView(props) {
  const showWebNavigationItem = hasWebsitesAccess;
  const showMobileAppNavigationItem = hasMobileAppsAccess;

  const isWebsiteView$ = all(
    isView(websiteMonitoringPath),
    isWebsiteAnalyzeView.map(v => !v)
  );
  const isMobileAppView$ = all(
    isView(mobileAppMonitoringPath),
    isMobileAppAnalyzeView.map(v => !v)
  );

  if (showWebNavigationItem && showMobileAppNavigationItem) {
    return (
      <View
        id="main-nav-websites"
        label="Websites & Mobile Apps"
        icon="lib_website_mobile_app_inverted"
        href$={getView(websiteMonitoringPath)}
        isActive$={any(isWebsiteView$, isMobileAppView$)}
        {...props}
      />
    );
  }

  if (showWebNavigationItem) {
    return (
      <View
        id="main-nav-websites"
        label="Websites"
        icon="lib_website_inverted"
        href$={getView(websiteMonitoringPath)}
        isActive$={isWebsiteView$}
        {...props}
      />
    );
  }

  if (showMobileAppNavigationItem) {
    return (
      <View
        id="main-nav-mobile-apps"
        label="Mobile Apps"
        icon="lib_mobile_app_inverted"
        href$={getView(mobileAppMonitoringPath)}
        isActive$={isMobileAppView$}
        {...props}
      />
    );
  }

  return null;
}

function Platforms(props) {
  const { expandedSubMenu, setExpandedSubMenu, sidebarIsExpanded, onMouseEnter, onMouseLeave } = props;

  let numPlatformsAvailable = 0;
  if (hasKubernetesAccess) numPlatformsAvailable++;
  if (pcfEnabled) numPlatformsAvailable++;
  if (vsphereEnabled) numPlatformsAvailable++;
  if (numPlatformsAvailable === 0) {
    return null;
  }

  const ViewItemForPlatforms = numPlatformsAvailable > 1 ? SubViewItem : View;
  const platforms = (
    <>
      {hasKubernetesAccess && (
        <ViewItemForPlatforms
          id="main-nav-kubernetes"
          label="Kubernetes"
          icon="lib_kubernetes_inverted"
          href$={getView(kubernetesClusterList)}
          isActive$={isView(kubernetes)}
          {...props}
        />
      )}

      {pcfEnabled && (
        <ViewItemForPlatforms
          id="main-nav-cloudfoundry"
          label="Cloud Foundry"
          icon="lib_cloudfoundry_inverted"
          href$={getView(cloudfoundryApplicationList)}
          isActive$={isView(cloudfoundry)}
          {...props}
        />
      )}

      {vsphereEnabled && (
        <ViewItemForPlatforms
          id="main-nav-vsphere"
          label="vSphere"
          icon="lib_vsphere_inverted"
          href$={getView(datacenterListFullyQualified)}
          isActive$={isView(vsphere)}
          {...props}
        />
      )}
    </>
  );

  if (numPlatformsAvailable > 1) {
    return (
      <View
        id="main-nav-platforms"
        label="Platforms"
        icon="lib_platforms_inverted"
        isActive$={any(isView(kubernetes), isView(cloudfoundry), isView(vsphere))}
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        sidebarIsExpanded={sidebarIsExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {platforms}
      </View>
    );
  }

  return platforms;
}

function Spacer() {
  return <li className={locals.spacer} />;
}
