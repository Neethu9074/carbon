import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { eventsPath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { websiteMonitoringPath, isAnalyzeView as isWebsiteAnalyzeView } from 'in-websites/navigation/paths';
import { releaseNotesEnabled, kubernetesEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import { SubViewItem } from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { agentsPath, settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { getLinkToAnalyze, isAnalyzeView } from 'in-analyze/navigation/paths';
import { isInstanaEmail, user, role, hasPermission } from 'in-stores/user';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getView, isView } from 'in-stores/navigation/navigation';
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
import { joinClassNames } from 'in-services/util/classnames';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { getColorBySeverity } from 'in-stores/events';
import { all, any } from 'in-services/fixedStreams';
import { config } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

const umpLink = `https://${config.butlerDomain}/ump/${config.tenant}/${config.tenantUnit}`;
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
        id="main-nav-infrastructure"
        label="Infrastructure"
        icon="lib_infrastructure_inverted"
        isActive$={any(isView(physicalPath), isView(containerPath), isTableView('physical'))}
        href$={getView(physicalPath)}
        expandedSubMenu={expandedSubMenu}
        {...commonProps}
      />

      {kubernetesEnabled &&
        hasPermission('ACCESS_KUBERNETES') && (
          <View
            id="main-nav-kubernetes"
            label="Kubernetes"
            icon="lib_kubernetes_inverted"
            href$={getView(kubernetesClusterList)}
            isActive$={isView(kubernetes)}
            {...commonProps}
          />
        )}

      <Spacer />

      <View
        id="main-nav-application"
        label="Application"
        icon="lib_application_invert"
        isActive$={isView(isApplicationsView)}
        href$={getView(applicationsList)}
        {...commonProps}
      />

      {hasPermission('ACCESS_WEBSITES') && (
        <View
          id="main-nav-websites"
          label="Websites"
          icon="lib_website_inverted"
          href$={getView(websiteMonitoringPath)}
          isActive$={all(isView(websiteMonitoringPath), isWebsiteAnalyzeView.map(v => !v))}
          {...commonProps}
        />
      )}

      <View
        id="main-nav-analyze"
        label="Analyze"
        icon="lib_analyze_inverted"
        isActive$={any(isView(isAnalyzeView), isWebsiteAnalyzeView)}
        href$={getLinkToAnalyze({
          dataSource: 'traces',
          groupByTag: getConfigByDataSource('traces').defaultGrouping
        })}
        {...commonProps}
      />

      <Spacer />

      <IncidentsMenuPoint {...commonProps} />

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

      <Spacer />

      <View
        label="More"
        icon="lib_menu_additional_resources"
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        isActive$={any(isView(agentsPath))}
        sidebarIsExpanded={isExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        id="main-nav-more"
      >
        <SubViewItem label="Management Portal" href={umpLink} external id="main-nav-management-portal" />
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
            setActiveDialog(<AboutInstanaDialog />);
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
  // should always be visible when instanaInternalFeaturesEnabled is set. if not, then only when instana engineer AND isVisible
  if (!isInternalVisible || !isInstanaEmail) {
    return null;
  }

  return (
    <Fragment>
      <Spacer />
      <View
        label="Internal"
        icon="lib_actions_lock"
        isActive$={isView('/internal')}
        href$={just('/#/internal')}
        sidebarIsExpanded={sidebarIsExpanded}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
      />
    </Fragment>
  );
});

const IncidentsMenuPoint = connectTo(
  {
    events: openEventsAtServerTime$,
    isActive: isView(eventsPath)
  },
  function IncidentsMenuPoint({ events, isActive, sidebarIsExpanded, onClick, onMouseLeave }) {
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
          onMouseLeave={onMouseLeave}
        />
        {numIncidents > 0 && (
          <div className={locals.issueIndicator} style={{ background: color }}>
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
          <button className={joinClassNames(locals.signOutButton, className)} type="submit">
            Sign Out
            <span className={locals.userEmail}>{user.email}</span>
          </button>
        )}
      />
    </form>
  );
}

function Spacer() {
  return <li className={locals.spacer} />;
}
