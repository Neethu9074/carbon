import { combineLatest, just } from 'reactive-observables';
import React from 'react';

import {
  eventsPath,
  physicalTablePath,
  physicalPath,
  containerPath,
  cockpitPath,
  isTableView
} from 'in-stores/navigation/paths/mainPaths';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { kubernetesEnabled, cockpitEnabled, instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { websiteMonitoringPath, isAnalyzeView as isWebsiteAnalyzeView } from 'in-websites/navigation/paths';
import { SubViewItem } from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { agentsPath, settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { getLinkToAnalyze, isAnalyzeView } from 'in-analyze/navigation/paths';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getView, isView } from 'in-stores/navigation/navigation';
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
import { releaseNotesEnabled } from 'in-services/featureFlags';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { getColorBySeverity } from 'in-stores/events';
import { config } from 'in-services/config';
import { user, role } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

const umpLink = `https://${config.butlerDomain}/ump/${config.tenant}/${config.tenantUnit}`;

export default function ViewSwitcher({ isExpanded, expandedSubMenu, setExpandedSubMenu }) {
  return (
    <ul className={locals.list}>
      <View
        label="Infrastructure"
        icon="lib_infrastructure_inverted"
        isActive$={any(isView(physicalPath), isView(containerPath), isTableView('physical'))}
        sidebarIsExpanded={isExpanded}
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
      >
        <SubViewItem
          label="Map"
          href$={getView(physicalPath)}
          isActive$={any(isView(physicalPath), isView(containerPath))}
        />
        <SubViewItem label="Comparison Table" href$={getView(physicalTablePath)} isActive$={isTableView('physical')} />
      </View>

      {kubernetesEnabled && (
        <View
          label="Kubernetes"
          icon="lib_kubernetes_inverted"
          href$={getView(kubernetesClusterList)}
          isActive$={isView(kubernetes)}
          sidebarIsExpanded={isExpanded}
        />
      )}

      <Spacer />

      <View
        label="Application"
        icon="lib_application_invert"
        isActive$={isView(isApplicationsView)}
        href$={getView(applicationsList)}
        sidebarIsExpanded={isExpanded}
      />

      <View
        label="Websites"
        icon="lib_website_inverted"
        href$={getView(websiteMonitoringPath)}
        isActive$={all(isView(websiteMonitoringPath), isWebsiteAnalyzeView.map(v => !v))}
        sidebarIsExpanded={isExpanded}
      />

      <View
        label="Analyze"
        icon="lib_analyze_inverted"
        isActive$={any(isView(isAnalyzeView), isWebsiteAnalyzeView)}
        href$={getLinkToAnalyze({
          dataSource: 'traces',
          groupByTag: getConfigByDataSource('traces').defaultGrouping
        })}
        sidebarIsExpanded={isExpanded}
      />

      <Spacer />

      <IncidentsMenuPoint isExpanded={isExpanded} />

      <Spacer />

      <View
        label="Settings"
        icon="lib_actions_settings_inverted"
        isActive$={isView(settingsPath)}
        href$={getView(settingsPath)}
        sidebarIsExpanded={isExpanded}
      />

      {(cockpitEnabled || instanaInternalFeaturesEnabled) && <Spacer />}

      {cockpitEnabled && (
        <View
          label="cockpit"
          icon="dashboard"
          isActive$={isView(containerPath)}
          href$={getView(cockpitPath)}
          sidebarIsExpanded={isExpanded}
        />
      )}

      {instanaInternalFeaturesEnabled && (
        <View
          label="Internal"
          icon="lib_actions_lock"
          isActive$={just(false)}
          href$={just('/#/internal')}
          sidebarIsExpanded={isExpanded}
        />
      )}

      <Spacer />

      <View
        label={user.email}
        icon="lib_menu_account"
        sidebarIsExpanded={isExpanded}
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
      >
        <form action="/auth/signOut" method="post">
          <SubViewItem
            renderLabel={className => (
              <button className={className} type="submit">
                Sign Out
              </button>
            )}
          />
        </form>
      </View>

      <View
        label="Additional Resources"
        icon="lib_menu_additional_resources"
        sidebarIsExpanded={isExpanded}
        expandedSubMenu={expandedSubMenu}
        setExpandedSubMenu={setExpandedSubMenu}
        isActive$={any(isView(agentsPath))}
      >
        <SubViewItem label="Management Portal" href={umpLink} external />
        <SubViewItem label="Tenants" href="https://instana.io/tenantSwitcher" external />
        {role.canConfigureAgents && (
          <SubViewItem label="Agents" href$={getView(agentsPath)} isActive$={isView(agentsPath)} />
        )}
        {releaseNotesEnabled && <SubViewItem label="Release Notes" onClick={showReleaseNotes} />}
        <SubViewItem label="Documentation" href="https://docs.instana.com" external />
        <SubViewItem label="Support" className={locals.linkElement} href="https://support.instana.com" external />
        <SubViewItem label="About Instana" onClick={() => setActiveDialog(<AboutInstanaDialog />)} />
      </View>
    </ul>
  );
}

const IncidentsMenuPoint = connectTo(
  {
    events: openEventsAtServerTime$,
    isActive: isView(eventsPath)
  },
  function IncidentsMenuPoint({ events, isActive, isExpanded }) {
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
          sidebarIsExpanded={isExpanded}
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

function Spacer() {
  return <li className={locals.spacer} />;
}

function any() {
  const args = Array.from(arguments);
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a || b, false)));
}

function all() {
  const args = Array.from(arguments);
  // the observable should return true, if any of the given streams returns true
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a && b, true)));
}
