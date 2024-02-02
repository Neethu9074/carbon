/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { UIShell, MenuItem } from '@instana/components';
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
import { locationWithoutQueryParameter, urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
// @ts-expect-error no declaration file
import { ibmp, phmcListFullyQualified } from 'in-phmc/navigation/paths';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { playwithEnabled, playWithReleaseEnabled, actionAutomationEnabled } from 'in-services/featureFlags';
// @ts-expect-error no declaration file
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-components/Profiling/navigation/paths';
import { isSyntheticMonitoringView, syntheticsPath } from 'in-synthetics/navigation/paths';
import { powervcRegionListFullyQualified, powervc } from 'in-powervc/navigation/paths';
import { releaseNotesEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import { actionCatalogPath, isAutomationView } from 'in-automation/navigation/paths';
import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { isAnalyzeView as isLogsAnalyzeView } from 'in-logging/navigation/paths';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { isBizOpsView, businessProcessPath } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { ibmz, zhmcListFullyQualified } from 'in-zhmc/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import NewPlayWithHeader from 'in-plg/Demo/NewPlayWithHeader';
import { isAnalyzeView } from 'in-analyze/navigation/paths';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { eventsPath } from 'in-events/navigation/paths';
import { all, any } from 'in-services/fixedStreams';
import { config } from 'in-services/config';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function HomeLink() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const path = '/home';
  return (
    <MenuItem
      isActive={matchLocation(getRootPathPredicate(path))}
      icon="lib_home"
      href={createHrefToPath(path)}
      label={t('in-cockpit:cockpit.home')}
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
    <MenuItem icon="lib_platforms_inverted" label={t('in-components:mainNavigation.viewSwitcherLabelPlatforms')}>
      {/* Keep the list of platforms sorted alphabetically */}
      {hasPCFAccess && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelCloudFoundry')}
          href={createHrefToPath(cloudfoundryApplicationList)}
          isActive={matchLocation(cloudfoundry)}
        />
      )}
      {hasOpenStackAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelOpenstack')}
          href={createHrefToPath(regionListFullyQualified)}
          isActive={matchLocation(openstack)}
        />
      )}
      {hasPHMCAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelphmc')}
          href={createHrefToPath(phmcListFullyQualified)}
          isActive={matchLocation(ibmp)}
        />
      )}
      {hasPowerVcAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelPowervc')}
          href={createHrefToPath(powervcRegionListFullyQualified)}
          isActive={matchLocation(powervc)}
        />
      )}
      {hasZHMCAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelzhmc')}
          href={createHrefToPath(zhmcListFullyQualified)}
          isActive={matchLocation(ibmz)}
        />
      )}
      {hasKubernetesAccess && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelKubernetes')}
          href={createHrefToPath(kubernetesClusterList)}
          isActive={matchLocation(kubernetes)}
        />
      )}
      {hasSAPAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelSap')}
          href={createHrefToPath(sapSystemList)}
          isActive={matchLocation(sap)}
        />
      )}
      {hasVSphereAccess && !playwithEnabled && (
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelvSphere')}
          href={createHrefToPath(datacenterListFullyQualified)}
          isActive={matchLocation(vsphere)}
        />
      )}
    </MenuItem>
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

  if (!role?.canConfigureAutomationActions || !actionAutomationEnabled) {
    return null;
  }

  if (playwithEnabled) {
    return null;
  }

  return (
    <MenuItem
      label={t('in-automation:automation')}
      icon="lib_automation"
      isActive={matchLocation(isAutomationView)}
      href={createHrefToPath(actionCatalogPath)}
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
      label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
      icon="lib_service_level"
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
        label={t('in-components:mainNavigation.viewSwitcherLabelSettings')}
        icon="lib_actions_settings_inverted"
        isActive={matchLocation(settingsPath)}
        href={createHrefToPath(settingsPath)}
      />
      <InternalView />
      <MenuItem icon="lib_menu_additional_resources" label={t('in-components:mainNavigation.viewSwitcherLabelMore')}>
        {tenantSwitcherEnabled && (
          <MenuItem
            label={t('in-components:mainNavigation.viewSwitcherLabelTenants')}
            openInNewTab
            href={tenantSwitcherLink}
          />
        )}
        {role?.canConfigureAgents && (
          <MenuItem
            label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
            href={createHrefToPath(agentsPath)}
            isActive={matchLocation(agentsPath)}
          />
        )}
        {releaseNotesEnabled && (
          <MenuItem
            onClick={e => {
              showReleaseNotes();
              onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes'));
            }}
            label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
          />
        )}
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}
          openInNewTab
          href="https://www.ibm.com/docs/en/obi/current"
        />
        <MenuItem
          label={t('in-components:mainNavigation.viewSwitcherLabelSupport')}
          openInNewTab
          href="https://www.ibm.com/mysupport/s/?language=en_US"
        />
        <MenuItem
          onClick={e => {
            addActiveDialog(<AboutInstanaDialog />);
            onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelAboutInstana'));
          }}
          label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
        />
        <MenuItem onClick={signOut} label={t('in-components:mainNavigation.viewSwitcherButtonSignOut')} />
      </MenuItem>
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
  return (
    <UIShell headerContent={<HeaderContent />}>
      <HomeLink />
      <WebsiteMobileAppView />
      <BizOps />
      <Applications />
      <Platforms />
      <Infrastructure />
      <MenuItem isDivider />
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
