/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error promise loader
import NotificationBarSticky from 'promise-loader?global!in-components/Sticky/NotificationBarSticky';
// @ts-expect-error promise loader
import AboutInstanaDialog from 'promise-loader?global!in-components/AboutInstanaDialog';
// @ts-expect-error promise loader
import NewPlayWithHeader from 'promise-loader?global!in-plg/Demo/NewPlayWithHeader';
import React, { useEffect, useState } from 'react';

import {
  UIShell,
  MenuItem,
  SideNavMenu,
  SvgIcon,
  CarbonHeaderGlobalAction as HeaderGlobalAction,
  keyCodes
} from '@instana/components';
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
  hasInfrastructureAnalyzeAccess,
  hasAutomationAccess,
  hasNutanixAccess
} from 'in-stores/permission';
import {
  loggingEnabled,
  logHomepageEnabled,
  playwithEnabled,
  playWithReleaseEnabled,
  tenantSwitcherEnabled,
  userProfileMenuEnabled,
  vulnerabilityCenterEnabled,
  welcomePageV2Enabled
} from 'in-services/featureFlags';
import {
  isTableView,
  physicalPath,
  agentsPath,
  containerPath,
  infraSmartAlerts,
  infraSmartAlertsFullScreen,
  settingsPath
} from 'in-stores/navigation/paths/mainPaths';
import {
  useLinkToAnalyze as useLinkToMobileAppAnalyze,
  isAnalyzeView as isMobileAppAnalyzeView,
  mobileAppMonitoringPath
} from 'in-mobile-apps/navigation/paths';
import {
  isAnalyzeView as isLogsAnalyzeView,
  isLoggingView,
  loggingDashboardPath,
  logsPathWithDataSource
} from 'in-logging/navigation/paths';
import {
  applicationsList,
  isApplicationsView,
  useLinkToAnalyze as useLinkToApplicationAnalyze
} from 'in-applications/navigation/paths';
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
import { click as internalToggleClick } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { locationWithoutQueryParameter, urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
// @ts-expect-error no declaration file
import { ibmp, phmcListFullyQualified } from 'in-phmc/navigation/paths';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { isBizOpsView, businessPerspectivesPath, businessProcessPath } from 'in-bizops/navigation/paths';
// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { isVulnerabilityView, vulnerabilityRoot } from 'in-vulnerability-center/navigation/paths';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-components/Profiling/navigation/paths';
import { actionCatalogFullyQualified, isAutomationView } from 'in-automation/navigation/paths';
import { isSyntheticMonitoringView, syntheticsPath } from 'in-synthetics/navigation/paths';
import ProfileMenu from 'in-components/MainNavigation/components/ProfileMenu/ProfileMenu';
import { nutanixClusterListFullyQualified, nutanix } from 'in-nutanix/navigation/paths';
import { powervcRegionListFullyQualified, powervc } from 'in-powervc/navigation/paths';
import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { ibmz, zhmcListFullyQualified } from 'in-zhmc/navigation/paths';
import useUIShellTitleDetail from 'in-plg/hooks/useUIShellTitleDetail';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { isAnalyzeView } from 'in-analyze/navigation/constants';
import { releaseNotesEnabled } from 'in-services/featureFlags';
import { openEventsAtServerTime$ } from 'in-stores/events';
import AsyncComponent from 'in-components/AsyncComponent';
import { eventsPath } from 'in-events/navigation/paths';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { all, any } from 'in-services/fixedStreams';
import { role, user } from 'in-stores/user';
import config from 'in-services/config';
import { t } from 'in-i18n';

import local from './CarbonUIShell.mless';

interface HeaderContentProps {
  expanded?: boolean;
  onClickSideNavExpand?: VoidFunction;
}

const { isEscape } = keyCodes;

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
  const hostCount = window.instana?.reportingData?.hostCount;

  if (!hasBizOpsAccess) {
    return null;
  }

  // If there are no agents (hosts) detected, we want to disable the business
  // perspectives tab, and direct the users to the Processes tab directly
  if (typeof hostCount == 'number' && hostCount > 0) {
    return (
      <MenuItem
        id="main-nav-bizops"
        label={t('in-bizops:navigation.businessMonitoring')}
        icon="lib_bizops"
        isActive={matchLocation(isBizOpsView)}
        href={createHrefToPath(businessPerspectivesPath)}
      />
    );
  } else {
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

function platformsContent(
  matchLocation: (path: string) => boolean,
  createHrefToPath: (path: string) => string,
  optionalProps = {}
) {
  return [
    hasPCFAccess ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-cloudfoundry"
        key="main-nav-cloudfoundry"
        label={t('in-components:mainNavigation.viewSwitcherLabelCloudFoundry')}
        href={createHrefToPath(cloudfoundryApplicationList)}
        isActive={matchLocation(cloudfoundry)}
      />
    ) : null,
    hasPHMCAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-phmc"
        key="main-nav-phmc"
        label={t('in-components:mainNavigation.viewSwitcherLabelphmc')}
        href={createHrefToPath(phmcListFullyQualified)}
        isActive={matchLocation(ibmp)}
      />
    ) : null,
    hasPowerVcAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-powervc"
        key="main-nav-powervc"
        label={t('in-components:mainNavigation.viewSwitcherLabelPowervc')}
        href={createHrefToPath(powervcRegionListFullyQualified)}
        isActive={matchLocation(powervc)}
      />
    ) : null,
    hasZHMCAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-zhmc"
        key="main-nav-zhmc"
        label={t('in-components:mainNavigation.viewSwitcherLabelzhmc')}
        href={createHrefToPath(zhmcListFullyQualified)}
        isActive={matchLocation(ibmz)}
      />
    ) : null,
    hasOpenStackAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-openstack"
        key="main-nav-openstack"
        label={t('in-components:mainNavigation.viewSwitcherLabelOpenstack')}
        href={createHrefToPath(regionListFullyQualified)}
        isActive={matchLocation(openstack)}
      />
    ) : null,
    hasKubernetesAccess ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-kubernetes"
        key="main-nav-kubernetes"
        label={t('in-components:mainNavigation.viewSwitcherLabelKubernetes')}
        href={createHrefToPath(kubernetesClusterList)}
        isActive={matchLocation(kubernetes)}
      />
    ) : null,
    hasNutanixAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-nutanix"
        key="main-nav-nutanix"
        label={t('in-components:mainNavigation.viewSwitcherLabelNutanix')}
        href={createHrefToPath(nutanixClusterListFullyQualified)}
        isActive={matchLocation(nutanix)}
      />
    ) : null,
    hasSAPAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-sap"
        key="main-nav-sap"
        label={t('in-components:mainNavigation.viewSwitcherLabelSap')}
        href={createHrefToPath(sapSystemList)}
        isActive={matchLocation(sap)}
      />
    ) : null,
    hasVSphereAccess && !playwithEnabled ? (
      <MenuItem
        {...optionalProps}
        id="main-nav-vsphere"
        key="main-nav-vsphere"
        label={t('in-components:mainNavigation.viewSwitcherLabelvSphere')}
        href={createHrefToPath(datacenterListFullyQualified)}
        isActive={matchLocation(vsphere)}
      />
    ) : null
  ];
}

function Infrastructure() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isTableViewActive = useObservable(isTableView('physical'), []);

  if (!hasInfrastructureAccess) {
    return null;
  }

  const isActive =
    matchLocation(physicalPath, containerPath, infraSmartAlerts, infraSmartAlertsFullScreen) || isTableViewActive;

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
  const { matchLocation, createHrefToPath } = useNavigation();
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

  if (!hasAnalyzeAccess && !role?.canViewLogs) {
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
          // eslint-disable-next-line no-console
          role?.canViewLogs && just(createHrefToPath(logsPathWithDataSource)),
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

function VulnerabilityCenter() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const { trackVulnerabilitiesInNavigation } = useVulnerabilityTracker();

  if (!vulnerabilityCenterEnabled) {
    return null;
  }

  return (
    <MenuItem
      id="main-nav-vul-dashboard"
      label={t('in-components:mainNavigation.viewVulnerabilityCenter')}
      icon="lib_events_cve"
      isActive={matchLocation(isVulnerabilityView)}
      onClick={trackVulnerabilitiesInNavigation}
      href={createHrefToPath(vulnerabilityRoot)}
    />
  );
}

function Incidents() {
  const events = useObservable(openEventsAtServerTime$, [openEventsAtServerTime$]);
  // @ts-expect-error type not defined
  const numIncidents = events ? events.get('incidentCount') : 0;

  const { matchLocation } = useNavigation();
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const menuItemHref = getEventsViewFilteredBy({ eventTypeFilter: 'incident' });

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
      href={menuItemHref}
      isActive={isActive}
    />
  );
}

function AutomationMenu() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasAutomationAccess) {
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
      isActive={matchLocation(isSloView)}
      href={createHrefToPath(serviceLevelsOverview)}
      isBeta
    />
  );
}

function Logging() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!loggingEnabled || !role?.canViewLogs || !logHomepageEnabled) {
    return null;
  }
  return (
    <MenuItem
      id="main-nav-logging"
      label={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
      icon="lib_application_logging"
      isActive={matchLocation(isLoggingView)}
      href={createHrefToPath(loggingDashboardPath)}
    />
  );
}

function Synthetics() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSyntheticsAccess) {
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

function Settings() {
  const { matchLocation, createHrefToPath } = useNavigation();
  if (playwithEnabled) {
    return null;
  }
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
    </>
  );
}

function moreContent(matchLocation: (path: string) => boolean, createHrefToPath: (path: string) => string) {
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

  return [
    !userProfileMenuEnabled && tenantSwitcherEnabled ? (
      <MenuItem
        id="main-nav-tenants"
        key="main-nav-tenants"
        label={t('in-components:mainNavigation.viewSwitcherLabelTenants')}
        openInNewTab
        href={tenantSwitcherLink}
      />
    ) : null,
    role?.canConfigureAgents ? (
      <MenuItem
        id="main-nav-agents"
        key="main-nav-agents"
        label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
        href={createHrefToPath(agentsPath)}
        isActive={matchLocation(agentsPath)}
      />
    ) : null,
    releaseNotesEnabled ? (
      <MenuItem
        id="main-nav-release-notes"
        key="main-nav-release-notes"
        onClick={() => {
          showReleaseNotes();
        }}
        label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
      />
    ) : null,
    <MenuItem
      id="main-nav-documentation"
      key="main-nav-documentation"
      label={t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}
      openInNewTab
      href="https://www.ibm.com/docs/en/obi/current"
    />,
    <MenuItem
      id="main-nav-support"
      key="main-nav-support"
      label={t('in-components:mainNavigation.viewSwitcherLabelSupport')}
      openInNewTab
      href="https://www.ibm.com/mysupport/s/?language=en_US"
    />,
    <MenuItem
      id="main-nav-about"
      key="main-nav-about"
      onClick={() => {
        addActiveDialog(<AsyncComponent component={AboutInstanaDialog} />);
      }}
      label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
    />,
    !userProfileMenuEnabled && (
      <div key="main-nav-sign-out" className={local.signOutButton}>
        <MenuItem
          id="main-nav-sign-out"
          onClick={signOut}
          label={
            <>
              <div>{t('in-components:mainNavigation.viewSwitcherButtonSignOut')}</div>
              <div className={local.emailAddress}>{user?.email}</div>
            </>
          }
        />
      </div>
    )
  ];
}

function HeaderContent({ expanded, onClickSideNavExpand }: HeaderContentProps) {
  return (
    <>
      {playwithEnabled || playWithReleaseEnabled ? <AsyncComponent component={NewPlayWithHeader} /> : null}
      <AsyncComponent component={NotificationBarSticky} />
      {userProfileMenuEnabled && !playwithEnabled && (
        <div id="profileMenu-switcher">
          <HeaderGlobalAction
            onClick={onClickSideNavExpand}
            aria-label={t('in-components:mainNavigation.profileMenu_tooltip')}
            aria-expanded={expanded}
            isActive={expanded}
            aria-haspopup="true"
            tooltipAlignment="end"
          >
            <UserIcon size="s" color="var(--cds-icon-secondary)" />
          </HeaderGlobalAction>
        </div>
      )}
    </>
  );
}

export default function CarbonUIShell() {
  const { matchLocation, createHrefToPath, location } = useNavigation();
  const titleDetail = useUIShellTitleDetail();
  const platforms = platformsContent(matchLocation, createHrefToPath).filter(Boolean);
  const [expanded, setExpanded] = useState(false);

  const onClickSideNavExpand = () => setExpanded(!expanded);

  // If header panel is open, and user clicks outside, close it
  const handleKeyPress = (event: KeyboardEvent) => {
    if (isEscape(event)) {
      setExpanded(false);
    }
  };
  const handleClickOutside = (event: MouseEvent) => {
    const focusedElement = document.activeElement as HTMLElement;
    const isPanelContent = focusedElement?.closest('.cds--header-panel--expanded');
    const isHeaderAction = focusedElement?.closest('.cds--header__action');
    const switcherButton = document.getElementById('profileMenu-switcher');
    const isProfileMenuSwitcher = switcherButton?.contains(event.target as Node);

    if (!isPanelContent && !isHeaderAction && !isProfileMenuSwitcher) {
      setExpanded(false);
    }
  };

  // Add event listener for outside of header panel clicks
  useEffect(() => {
    if (expanded) {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('keydown', handleKeyPress, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [expanded]);

  useEffect(() => {
    // @ts-expect-error ibmStats is not present in window type.
    window?.ibmStats?.pageview();
  }, [location]);

  return (
    <UIShell
      skipToContentText={t('in-components:mainNavigation.skipToMainContent')}
      onSideNavClick={internalToggleClick}
      titleDetail={titleDetail}
      {...(userProfileMenuEnabled
        ? {
            headerContent: <HeaderContent expanded={expanded} onClickSideNavExpand={onClickSideNavExpand} />,
            headerPanelExpanded: expanded,
            headerPanelContent: <ProfileMenu isSideNavExpanded={expanded} onClickSideNavExpand={onClickSideNavExpand} />
          }
        : { headerContent: <HeaderContent /> })}
    >
      <HomeLink />
      <WebsiteMobileAppView />
      <BizOps />
      <Applications />
      {/* If there are multiple platforms, render them in a SideNavMenu */}
      {platforms.length > 1 && (
        <SideNavMenu
          renderIcon={() => <SvgIcon color="white" size="s" type="lib_platforms_inverted" />}
          title={t('in-components:mainNavigation.viewSwitcherLabelPlatforms')}
        >
          {platforms}
        </SideNavMenu>
      )}
      {/* If there is only one platform, render outside of a menu, with an icon */}
      {platforms.length === 1 &&
        platformsContent(matchLocation, createHrefToPath, {
          icon: 'lib_platforms_inverted'
        })}
      <Infrastructure />
      <MenuItem isDivider />
      {welcomePageV2Enabled && <CustomDashboards />}
      <Logging />
      <Synthetics />
      <Analyze />
      <VulnerabilityCenter />
      <Incidents />
      <AutomationMenu />
      <SloDashboard />
      <MenuItem isDivider />
      <Settings />
      {!playwithEnabled && (
        <SideNavMenu
          renderIcon={() => <SvgIcon color="white" size="s" type="lib_menu_additional_resources" />}
          title={t('in-components:mainNavigation.viewSwitcherLabelMore')}
          isSideNavExpanded
        >
          {moreContent(matchLocation, createHrefToPath).filter(Boolean)}
        </SideNavMenu>
      )}
    </UIShell>
  );
}
