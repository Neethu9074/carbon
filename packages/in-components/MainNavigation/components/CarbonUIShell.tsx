/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { UIShell, MenuItem, SideNavMenu, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  hasAnalyzeAccess,
  hasApplicationsAccess,
  hasBizOpsAccess,
  hasEventsAccess,
  hasInfrastructureAccess,
  hasKubernetesAccess,
  hasMobileAppsAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasSyntheticsAccess,
  hasVSphereAccess,
  hasWebsitesAccess,
  hasZHMCAccess,
  hasSAPAccess,
  hasSloAccess,
  hasInfrastructureAnalyzeAccess
} from 'in-stores/permission';
import {
  useLinkToAnalyze as useLinkToMobileAppAnalyze,
  isAnalyzeView as isMobileAppAnalyzeView,
  mobileAppMonitoringPath
} from 'in-mobile-apps/navigation/paths';
import {
  isTableView,
  physicalPath,
  agentsPath,
  containerPath,
  infraSmartAlerts,
  settingsPath
} from 'in-stores/navigation/paths/mainPaths';
import {
  applicationsList,
  isApplicationsView,
  useLinkToAnalyze as useLinkToApplicationAnalyze
} from 'in-applications/navigation/paths';
import {
  playwithEnabled,
  playWithReleaseEnabled,
  actionAutomationEnabled,
  welcomePageV2Enabled
} from 'in-services/featureFlags';
import {
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
// @ts-expect-error no declaration file
import { sapSystemListFullyQualified as sapSystemList, sap } from 'in-sap/navigation/paths';
import {
  websiteMonitoringPath,
  isAnalyzeView as isWebsiteAnalyzeView,
  useLinkToAnalyze
} from 'in-websites/navigation/paths';
import {
  applicationListFullyQualified as cloudfoundryApplicationList,
  cloudfoundry
} from 'in-cloudfoundry/navigation/paths';
// @ts-expect-error no declaration file
import { openstack, regionListFullyQualified } from 'in-openstack/navigation/paths';
//@ts-expect-error missing declaration file
import NotificationBarSticky from 'in-components/Sticky/NotificationBarSticky';
import { click as internalToggleClick } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { locationWithoutQueryParameter, urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
// @ts-expect-error no declaration file
import { ibmp, phmcListFullyQualified } from 'in-phmc/navigation/paths';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
// @ts-expect-error no declaration file
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-components/Profiling/navigation/paths';
import { actionCatalogFullyQualified, isAutomationView } from 'in-automation/navigation/paths';
import { isSyntheticMonitoringView, syntheticsPath } from 'in-synthetics/navigation/paths';
import { powervcRegionListFullyQualified, powervc } from 'in-powervc/navigation/paths';
import { releaseNotesEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { isAnalyzeView as isLogsAnalyzeView } from 'in-logging/navigation/paths';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { isBizOpsView, businessProcessPath } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { ibmz, zhmcListFullyQualified } from 'in-zhmc/navigation/paths';
import useUIShellTitleDetail from 'in-plg/hooks/useUIShellTitleDetail';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import NewPlayWithHeader from 'in-plg/Demo/NewPlayWithHeader';
import { isAnalyzeView } from 'in-analyze/navigation/paths';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { eventsPath } from 'in-events/navigation/paths';
import { all, any } from 'in-services/fixedStreams';
import { config } from 'in-services/config';
import { role, user } from 'in-stores/user';
import { t } from 'in-i18n';

import local from './CarbonUIShell.mless';

function HomeLink() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const path = '/home';
  return (
    <MenuItem
      id="main-nav-system-overview"
      isActive={matchLocation(getRootPathPredicate(path))}
      icon="lib_home"
      href={createHrefToPath(path)}
      label={t('in-cockpit:cockpit.home')}
    />
  );
}

function CustomDashboards() {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <MenuItem
      id="main-nav-custom-dashboards"
      icon="lib_custom_dashboard"
      label={t('in-components:mainNavigation.viewSwitcherCustomDashboards')}
      isActive={matchLocation(customDashboardsPath)}
      href={createHrefToPath(customDashboardsPath)}
    />
  );
}

function WebsiteMobileAppView() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const loc = useLocation();
  const showWebNavigationItem = hasWebsitesAccess;
  const showMobileAppNavigationItem = hasMobileAppsAccess;

  const isWebsiteView$ = all(
    just(matchLocation(websiteMonitoringPath)),
    isWebsiteAnalyzeView.map((v: any) => !v)
  );
  const isMobileAppView$ = all(
    just(matchLocation(mobileAppMonitoringPath)),
    isMobileAppAnalyzeView.map((v: any) => !v)
  );

  if (showWebNavigationItem && showMobileAppNavigationItem) {
    return (
      <MenuItem
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsitesAndMobileApps')}
        icon="lib_website_mobile_app_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={any(isWebsiteView$, isMobileAppView$)}
        clientLocation={loc}
      />
    );
  }

  if (showWebNavigationItem) {
    return (
      <MenuItem
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsites')}
        icon="lib_website_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={isWebsiteView$}
        clientLocation={loc}
      />
    );
  }

  if (showMobileAppNavigationItem) {
    return (
      <MenuItem
        id="main-nav-mobile-apps"
        label={t('in-components:mainNavigation.viewSwitcherLabelMobileApps')}
        icon="lib_mobile_app_inverted"
        href={createHrefToPath(mobileAppMonitoringPath)}
        isActive$={isMobileAppView$}
        clientLocation={loc}
      />
    );
  }

  return null;
}

function BizOps() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasBizOpsAccess) {
    return null;
  }
  if (playwithEnabled) {
    return null;
  }
  return (
    <MenuItem
      id="main-nav-bizops"
      label={t('in-bizops:navigation.businessMonitoring')}
      icon="lib_bizops"
      isActive={matchLocation(isBizOpsView)}
      href={createHrefToPath(businessProcessPath)}
    />
  );
}

function Applications() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasApplicationsAccess) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-application"
      label={t('in-components:mainNavigation.viewSwitcherLabelApplications')}
      icon="lib_application_invert"
      isActive={matchLocation(isApplicationsView)}
      href={createHrefToPath(applicationsList)}
    />
  );
}

function Platforms() {
  const { matchLocation, createHrefToPath } = useNavigation();

  let numPlatformsAvailable = 0;
  if (hasOpenStackAccess) numPlatformsAvailable++;
  if (hasPCFAccess) numPlatformsAvailable++;
  if (hasPHMCAccess) numPlatformsAvailable++;
  if (hasPowerVcAccess) numPlatformsAvailable++;
  if (hasZHMCAccess) numPlatformsAvailable++;
  if (hasKubernetesAccess) numPlatformsAvailable++;
  if (hasVSphereAccess) numPlatformsAvailable++;
  if (hasSAPAccess) numPlatformsAvailable++;
  if (numPlatformsAvailable === 0) {
    return null;
  }

  return (
    <SideNavMenu
      renderIcon={() => <SvgIcon color="white" size="s" type="lib_platforms_inverted" />}
      title={t('in-components:mainNavigation.viewSwitcherLabelPlatforms')}
      isSideNavExpanded
    >
      {/* Keep the list of platforms sorted alphabetically */}
      {hasPCFAccess && (
        <MenuItem
          id="main-nav-cloudfoundry"
          label={t('in-components:mainNavigation.viewSwitcherLabelCloudFoundry')}
          href={createHrefToPath(cloudfoundryApplicationList)}
          isActive={matchLocation(cloudfoundry)}
        />
      )}
      {hasOpenStackAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-openstack"
          label={t('in-components:mainNavigation.viewSwitcherLabelOpenstack')}
          href={createHrefToPath(regionListFullyQualified)}
          isActive={matchLocation(openstack)}
        />
      )}
      {hasPHMCAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-phmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelphmc')}
          href={createHrefToPath(phmcListFullyQualified)}
          isActive={matchLocation(ibmp)}
        />
      )}
      {hasPowerVcAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-powervc"
          label={t('in-components:mainNavigation.viewSwitcherLabelPowervc')}
          href={createHrefToPath(powervcRegionListFullyQualified)}
          isActive={matchLocation(powervc)}
        />
      )}
      {hasZHMCAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-zhmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelzhmc')}
          href={createHrefToPath(zhmcListFullyQualified)}
          isActive={matchLocation(ibmz)}
        />
      )}
      {hasKubernetesAccess && (
        <MenuItem
          id="main-nav-kubernetes"
          label={t('in-components:mainNavigation.viewSwitcherLabelKubernetes')}
          href={createHrefToPath(kubernetesClusterList)}
          isActive={matchLocation(kubernetes)}
        />
      )}
      {hasSAPAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-sap"
          label={t('in-components:mainNavigation.viewSwitcherLabelSap')}
          href={createHrefToPath(sapSystemList)}
          isActive={matchLocation(sap)}
          infoTag={t('in-components:featureFeedback.labelBETA')}
        />
      )}
      {hasVSphereAccess && !playwithEnabled && (
        <MenuItem
          id="main-nav-vsphere"
          label={t('in-components:mainNavigation.viewSwitcherLabelvSphere')}
          href={createHrefToPath(datacenterListFullyQualified)}
          isActive={matchLocation(vsphere)}
        />
      )}
    </SideNavMenu>
  );
}

function Infrastructure() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isTableViewActive = useObservable(isTableView('physical'), []);

  if (!hasInfrastructureAccess) {
    return null;
  }

  const isActive = matchLocation(physicalPath, containerPath, infraSmartAlerts) || isTableViewActive;

  return (
    <MenuItem
      id="main-nav-infrastructure"
      label={t('in-components:mainNavigation.viewSwitcherlabelInfrastructure')}
      icon="lib_infrastructure_inverted"
      isActive={isActive || false}
      href={createHrefToPath(physicalPath)}
    />
  );
}

function Analyze() {
  const { matchLocation } = useNavigation();
  const isActiveLegacy = useObservable(
    any(isWebsiteAnalyzeView, isMobileAppAnalyzeView, isProfileAnalyzeView, isLogsAnalyzeView, isInfraExploreView()),
    []
  );

  const analyzeHref = useLinkToAnalyze({
    beaconType: 'pageLoad',
    groupBy: {}
  });
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const getLinkToMobileAppAnalyze = useLinkToMobileAppAnalyze();
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  if (!hasAnalyzeAccess) {
    return null;
  }

  const isActive = matchLocation(isAnalyzeView) || isActiveLegacy;

  return (
    <MenuItem
      id="main-nav-analyze"
      label={t('in-components:mainNavigation.viewSwitcherLabelAnalytics')}
      icon="lib_analyze_inverted"
      isActive={isActive || false}
      // @ts-expect-error incorrect type in ui-foundation
      href$={
        [
          hasApplicationsAccess &&
            just(
              urlWithoutQueryParameter(
                getLinkToApplicationAnalyze({
                  dataSource: 'calls'
                })
              )
            ),
          hasWebsitesAccess && just(analyzeHref),
          hasMobileAppsAccess &&
            just(
              getLinkToMobileAppAnalyze({
                beaconType: 'sessionStart',
                groupBy: {}
              })
            ),
          hasInfrastructureAnalyzeAccess && just(getLinkToInfraEntityExplore(defaultInfraExploreViewParams))
        ].filter(Boolean)[0]
      }
    />
  );
}

function Incidents() {
  const events = useObservable(openEventsAtServerTime$, [openEventsAtServerTime$]);

  // @ts-expect-error type not defined
  const numIncidents = events ? events.get('incidentCount') : 0;

  const { matchLocation } = useNavigation();

  const isActive = matchLocation(eventsPath);

  if (!hasEventsAccess) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-events"
      label={t('in-components:mainNavigation.viewSwitcherLabelEvents')}
      icon="lib_events_inverted"
      badgeCount={numIncidents}
      href$={getEventsViewFilteredBy({ eventTypeFilter: 'incident' })}
      isActive={isActive}
    />
  );
}

function AutomationMenu() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!actionAutomationEnabled) {
    return null;
  }

  if (playwithEnabled) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-automation-dashboard"
      label={t('in-automation:automation')}
      icon="lib_automation"
      isActive={matchLocation(isAutomationView)}
      href={createHrefToPath(actionCatalogFullyQualified)}
    />
  );
}

function SloDashboard() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSloAccess) {
    return null;
  }
  if (playwithEnabled) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-slo-dashboard"
      label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
      icon="lib_service_level"
      infoTag={t('in-components:featureFeedback.labelBETA')}
      isActive={matchLocation(isSloView)}
      href={createHrefToPath(serviceLevelsOverview)}
    />
  );
}

function Synthetics() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSyntheticsAccess) {
    return null;
  }
  if (playwithEnabled) {
    return null;
  }
  return (
    <MenuItem
      id="main-nav-synthetics"
      label={t('in-synthetics:navigation.synthetics')}
      icon="lib_synthetic"
      isActive={matchLocation(isSyntheticMonitoringView)}
      href={createHrefToPath(syntheticsPath)}
    />
  );
}

function InternalView() {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, createHref, matchLocation } = useNavigation();
  const targetLocation = locationWithoutQueryParameter({ ...location, pathname: '/internal' });

  if (!isInternalVisible) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-internal"
      label={t('in-components:mainNavigation.viewSwitcherLabelInternal')}
      icon="lib_actions_lock"
      isActive={matchLocation('/internal')}
      href={createHref(targetLocation)}
    />
  );
}

function signOut() {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/auth/signOut';
  document.body.appendChild(form);
  form.submit();
}

// Settings and "More" dropdown
function SettingsAndMore({ onViewSwitched }: CarbonUIShellProps) {
  const { matchLocation, createHrefToPath } = useNavigation();
  if (playwithEnabled) {
    return null;
  }
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;
  return (
    <>
      <MenuItem
        id="main-nav-settings"
        label={t('in-components:mainNavigation.viewSwitcherLabelSettings')}
        icon="lib_actions_settings_inverted"
        isActive={matchLocation(settingsPath)}
        href={createHrefToPath(settingsPath)}
      />
      <InternalView />
      <SideNavMenu
        renderIcon={() => <SvgIcon color="white" size="s" type="lib_menu_additional_resources" />}
        title={t('in-components:mainNavigation.viewSwitcherLabelMore')}
        isSideNavExpanded
      >
        {tenantSwitcherEnabled && (
          <MenuItem
            id="main-nav-tenants"
            label={t('in-components:mainNavigation.viewSwitcherLabelTenants')}
            openInNewTab
            href={tenantSwitcherLink}
          />
        )}
        {role?.canConfigureAgents && (
          <MenuItem
            id="main-nav-agents"
            label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
            href={createHrefToPath(agentsPath)}
            isActive={matchLocation(agentsPath)}
          />
        )}
        {releaseNotesEnabled && (
          <MenuItem
            id="main-nav-release-notes"
            onClick={e => {
              showReleaseNotes();
              onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes'));
            }}
            label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
          />
        )}
        <MenuItem
          id="main-nav-documentation"
          label={t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}
          openInNewTab
          href="https://www.ibm.com/docs/en/obi/current"
        />
        <MenuItem
          id="main-nav-support"
          label={t('in-components:mainNavigation.viewSwitcherLabelSupport')}
          openInNewTab
          href="https://www.ibm.com/mysupport/s/?language=en_US"
        />
        <MenuItem
          id="main-nav-about"
          onClick={e => {
            addActiveDialog(<AboutInstanaDialog />);
            onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelAboutInstana'));
          }}
          label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
        />
        <div className={local.signOutButton}>
          <MenuItem
            onClick={signOut}
            label={
              <>
                <div>{t('in-components:mainNavigation.viewSwitcherButtonSignOut')}</div>
                <div className={local.emailAddress}>{user?.email}</div>
              </>
            }
          />
        </div>
      </SideNavMenu>
    </>
  );
}

function HeaderContent() {
  return (
    <>
      {playwithEnabled || playWithReleaseEnabled ? <NewPlayWithHeader /> : null}
      <NotificationBarSticky />
    </>
  );
}

type CarbonUIShellProps = {
  onViewSwitched: (e: React.MouseEvent<HTMLElement>, label: string) => void;
};

export default function CarbonUIShell({ onViewSwitched }: CarbonUIShellProps) {
  const titleDetail = useUIShellTitleDetail();

  return (
    <UIShell onSideNavClick={internalToggleClick} titleDetail={titleDetail} headerContent={<HeaderContent />}>
      <HomeLink />
      <WebsiteMobileAppView />
      <BizOps />
      <Applications />
      <Platforms />
      <Infrastructure />
      <MenuItem isDivider />
      {welcomePageV2Enabled && <CustomDashboards />}
      <Synthetics />
      <Analyze />
      <Incidents />
      <AutomationMenu />
      <SloDashboard />
      <MenuItem isDivider />
      <SettingsAndMore onViewSwitched={onViewSwitched} />
    </UIShell>
  );
}
