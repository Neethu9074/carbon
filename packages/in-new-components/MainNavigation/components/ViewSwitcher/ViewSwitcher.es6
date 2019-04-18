import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import isInternalVisible$ from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { websiteMonitoringPath, isAnalyzeView as isWebsiteAnalyzeView } from 'in-websites/navigation/paths';
import { eventsPath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SubViewItem } from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
import { instanaInternalFeaturesEnabled, releaseNotesEnabled } from 'in-services/featureFlags';
import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { agentsPath, settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { getLinkToAnalyze, isAnalyzeView } from 'in-analyze/navigation/paths';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getView, isView } from 'in-stores/navigation/navigation';
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
import { joinClassNames } from 'in-services/util/classnames';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { getColorBySeverity } from 'in-stores/events';
import { all, any } from 'in-services/fixedStreams';
import { isInstanaEngineer } from 'in-stores/user';
import { config } from 'in-services/config';
import { user, role } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

const umpLink = `https://${config.butlerDomain}/ump/${config.tenant}/${config.tenantUnit}`;

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
        label="Infrastructure"
        icon="lib_infrastructure_inverted"
        isActive$={any(isView(physicalPath), isView(containerPath), isTableView('physical'))}
        href$={getView(physicalPath)}
        expandedSubMenu={expandedSubMenu}
        {...commonProps}
      />

      {kubernetesEnabled && (
        <View
          label="Kubernetes"
          icon="lib_kubernetes_inverted"
          href$={getView(kubernetesClusterList)}
          isActive$={isView(kubernetes)}
          {...commonProps}
        />
      )}

      <Spacer />

      <View
        label="Application"
        icon="lib_application_invert"
        isActive$={isView(isApplicationsView)}
        href$={getView(applicationsList)}
        {...commonProps}
      />

      <View
        label="Websites"
        icon="lib_website_inverted"
        href$={getView(websiteMonitoringPath)}
        isActive$={all(isView(websiteMonitoringPath), isWebsiteAnalyzeView.map(v => !v))}
        {...commonProps}
      />

      <View
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
        label="Settings"
        icon="lib_actions_settings_inverted"
        isActive$={isView(settingsPath)}
        href$={getView(settingsPath)}
        {...commonProps}
      />

      <InternalView sidebarIsExpanded={isExpanded} onClick={onViewSwitched} onMouseLeave={onMouseLeave} />

      <Spacer />

      <View
        label="Additional Resources"
        icon="lib_menu_additional_resources"
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        isActive$={any(isView(agentsPath))}
        sidebarIsExpanded={isExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SubViewItem label="Management Portal" href={umpLink} external />
        <SubViewItem label="Tenants" href="https://instana.io/tenantSwitcher" external />
        {role.canConfigureAgents && (
          <SubViewItem
            label="Agents"
            href$={getView(agentsPath)}
            isActive$={isView(agentsPath)}
            onClick={onViewSwitched}
          />
        )}
        {releaseNotesEnabled && (
          <SubViewItem
            label="Release Notes"
            onClick={e => {
              showReleaseNotes();
              onViewSwitched(e, 'Release Notes');
            }}
          />
        )}
        <SubViewItem label="Documentation" href="https://docs.instana.com" external />
        <SubViewItem label="Support" className={locals.linkElement} href="https://support.instana.com" external />
        <SubViewItem
          label="About Instana"
          onClick={e => {
            setActiveDialog(<AboutInstanaDialog />);
            onViewSwitched(e, 'About Instana');
          }}
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
  if (!instanaInternalFeaturesEnabled && (!isInternalVisible || !isInstanaEngineer)) {
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
