/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';
import { just } from '@instana/observables';

import {
  hasAnalyzeAccess,
  hasAPlatformAccess,
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
  applicationsList,
  isApplicationsView,
  useLinkToAnalyze as useLinkToApplicationAnalyze
} from 'in-applications/navigation/paths';
import {
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import {
  agentsPath,
  containerPath,
  isTableView,
  physicalPath,
  settingsPath
} from 'in-stores/navigation/paths/mainPaths';
import {
  isAnalyzeView as isWebsiteAnalyzeView,
  useLinkToAnalyze,
  websiteMonitoringPath
} from 'in-websites/navigation/paths';
import {
  applicationListFullyQualified as cloudfoundryApplicationList,
  cloudfoundry
} from 'in-cloudfoundry/navigation/paths';
import { locationWithoutQueryParameter, urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import { isAnalyzeView as isProfileAnalyzeView } from 'in-components/Profiling/navigation/paths';
import { sapSystemListFullyQualified as sapSystemList, sap } from 'in-sap/navigation/paths';
import { SubViewItem } from 'in-components/MainNavigation/components/ViewSwitcher/SubView';
import { isSyntheticMonitoringView, syntheticsPath } from 'in-synthetics/navigation/paths';
import { powervcRegionListFullyQualified, powervc } from 'in-powervc/navigation/paths';
import { actionCatalogPath, actionHistoryPath } from 'in-automation/navigation/paths';
import { releaseNotesEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { openstack, regionListFullyQualified } from 'in-openstack/navigation/paths';
import { datacenterListFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { isAnalyzeView as isLogsAnalyzeView } from 'in-logging/navigation/paths';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getColorBySeverity, openEventsAtServerTime$ } from 'in-stores/events';
import { isBizOpsView, businessProcessPath } from 'in-bizops/navigation/paths';
import View from 'in-components/MainNavigation/components/ViewSwitcher/View';
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { ibmp, phmcListFullyQualified } from 'in-phmc/navigation/paths';
import { ibmz, zhmcListFullyQualified } from 'in-zhmc/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { cockpit as cockpitPath } from 'in-cockpit/navigation/paths';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import AboutInstanaDialog from 'in-components/AboutInstanaDialog';
import Stan from 'in-components/MainNavigation/components/Stan';
import { isAnalyzeView } from 'in-analyze/navigation/paths';
import { playwithEnabled } from 'in-services/featureFlags';
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { eventsPath } from 'in-events/navigation/paths';
import { all, any } from 'in-services/fixedStreams';
import { role, user } from 'in-stores/user';
import { config } from 'in-services/config';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

const hasFirstSectionAccess =
  hasWebsitesAccess ||
  hasMobileAppsAccess ||
  hasBizOpsAccess ||
  hasApplicationsAccess ||
  hasAPlatformAccess ||
  hasInfrastructureAccess ||
  hasSyntheticsAccess;
const hasSecondSectionAcccess = hasAnalyzeAccess || hasEventsAccess;
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

  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <ul className={locals.list}>
      <View
        id="main-nav-system-overview"
        renderContent={() => <Stan />}
        isActive={matchLocation(cockpitPath, customDashboardsPath)}
        // Go to default landing page when clicking this button
        href={createHrefToPath('/')}
        {...commonProps}
      />
      <SpacerListItem />
      <WebsiteMobileAppView {...commonProps} />
      <BizOps {...commonProps} />
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
      <Synthetics {...commonProps} />

      {hasFirstSectionAccess && <SpacerListItem />}
      <Analyze {...commonProps} />
      {hasEventsAccess && <Incidents {...commonProps} />}
      <AutomationMenu {...commonProps} />
      <SloDashboard {...commonProps} />
      {hasSecondSectionAcccess && <SpacerListItem />}
      {!playwithEnabled && (
        <>
          <View
            id="main-nav-settings"
            label={t('in-components:mainNavigation.viewSwitcherLabelSettings')}
            icon="lib_actions_settings_inverted"
            isActive={matchLocation(settingsPath)}
            href={createHrefToPath(settingsPath)}
            {...commonProps}
          />
          <InternalView sidebarIsExpanded={isExpanded} onClick={onViewSwitched} onMouseLeave={onMouseLeave} />
          <View
            id="main-nav-more"
            label={t('in-components:mainNavigation.viewSwitcherLabelMore')}
            icon="lib_menu_additional_resources"
            expandedSubMenu={expandedSubMenu}
            setExpandedSubMenu={setExpandedSubMenu}
            isActive={matchLocation(agentsPath)}
            sidebarIsExpanded={isExpanded}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {tenantSwitcherEnabled && (
              <SubViewItem
                label={t('in-components:mainNavigation.viewSwitcherLabelTenants')}
                href={tenantSwitcherLink}
                external
                id="main-nav-tenants"
              />
            )}
            {role.canConfigureAgents && (
              <SubViewItem
                label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
                href={createHrefToPath(agentsPath)}
                isActive={matchLocation(agentsPath)}
                onClick={onViewSwitched}
                id="main-nav-agents"
              />
            )}
            {releaseNotesEnabled && (
              <SubViewItem
                label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
                onClick={e => {
                  showReleaseNotes();
                  onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes'));
                }}
                id="main-nav-release-notes"
              />
            )}
            <SubViewItem
              label={t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}
              href="https://www.ibm.com/docs/en/obi/current"
              external
              id="main-nav-documentation"
            />
            <SubViewItem
              label={t('in-components:mainNavigation.viewSwitcherLabelSupport')}
              className={locals.linkElement}
              href="https://www.ibm.com/mysupport/s/?language=en_US"
              external
              id="main-nav-support"
            />
            <SubViewItem
              label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
              onClick={e => {
                addActiveDialog(<AboutInstanaDialog />);
                onViewSwitched(e, t('in-components:mainNavigation.viewSwitcherLabelAboutInstana'));
              }}
              id="main-nav-about"
            />
            <SignOut />
          </View>
        </>
      )}
    </ul>
  );
}

function InternalView({ sidebarIsExpanded, onClick, onMouseLeave }) {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, createHref, matchLocation } = useNavigation();
  const targetLocation = locationWithoutQueryParameter({ ...location, pathname: '/internal' });

  if (!isInternalVisible) {
    return null;
  }

  return (
    <View
      label={t('in-components:mainNavigation.viewSwitcherLabelInternal')}
      icon="lib_actions_lock"
      isActive={matchLocation('/internal')}
      href={createHref(targetLocation)}
      sidebarIsExpanded={sidebarIsExpanded}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    />
  );
}

function Incidents({ sidebarIsExpanded, onClick, onMouseEnter, onMouseLeave }) {
  const events = useObservable(openEventsAtServerTime$, [openEventsAtServerTime$]);
  const { matchLocation } = useNavigation();

  const isActive = matchLocation(eventsPath);

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
        label={t('in-components:mainNavigation.viewSwitcherLabelEvents')}
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

function SignOut() {
  return (
    <form action="/auth/signOut" method="post">
      <SubViewItem
        renderLabel={className => (
          <button className={classNames(locals.signOutButton, className)} type="submit">
            {t('in-components:mainNavigation.viewSwitcherButtonSignOut')}
            <span className={locals.userEmail}>{user.email}</span>
          </button>
        )}
      />
    </form>
  );
}

function Infrastructure(props) {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isTableViewActive = useObservable(isTableView('physical'), []);

  if (!hasInfrastructureAccess) {
    return null;
  }

  const isActive = matchLocation(physicalPath, containerPath) || isTableViewActive;

  return (
    <View
      id="main-nav-infrastructure"
      label={t('in-components:mainNavigation.viewSwitcherlabelInfrastructure')}
      icon="lib_infrastructure_inverted"
      isActive={isActive}
      href={createHrefToPath(physicalPath)}
      {...props}
    />
  );
}

function Synthetics(props) {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSyntheticsAccess) {
    return null;
  }
  return (
    !playwithEnabled && (
      <View
        id="main-nav-synthetics"
        label={t('in-synthetics:navigation.synthetics')}
        icon={'lib_synthetic'}
        isActive={matchLocation(isSyntheticMonitoringView)}
        href={createHrefToPath(syntheticsPath)}
        {...props}
      />
    )
  );
}

function BizOps(props) {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasBizOpsAccess) {
    return null;
  }
  return (
    !playwithEnabled && (
      <View
        id="main-nav-bizops"
        label={t('in-bizops:navigation.businessMonitoring')}
        icon={'lib_bizops'}
        isActive={matchLocation(isBizOpsView)}
        href={createHrefToPath(businessProcessPath)}
        {...props}
      />
    )
  );
}

function Applications(props) {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasApplicationsAccess) {
    return null;
  }

  return (
    <View
      id="main-nav-application"
      label={t('in-components:mainNavigation.viewSwitcherLabelApplications')}
      icon="lib_application_invert"
      isActive={matchLocation(isApplicationsView)}
      href={createHrefToPath(applicationsList)}
      {...props}
    />
  );
}
function SloDashboard(props) {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSloAccess) {
    return null;
  }

  return (
    !playwithEnabled && (
      <View
        id="main-nav-slo-dashboard"
        label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
        icon="lib_service_level"
        isActive={matchLocation(isSloView)}
        href={createHrefToPath(serviceLevelsOverview)}
        isBeta
        {...props}
      />
    )
  );
}

function AutomationMenu(props) {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!role.canConfigureAutomationActions || !actionAutomationEnabled) {
    return null;
  }

  return (
    !playwithEnabled && (
      <View
        id="main-nav-automation-dashboard"
        label={t('in-automation:automation')}
        icon="lib_automation"
        isActive={matchLocation(actionCatalogPath) || matchLocation(actionHistoryPath)}
        href={createHrefToPath(actionCatalogPath)}
        isBeta
        {...props}
      />
    )
  );
}

function Analyze(props) {
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

  const isActive = matchLocation(isAnalyzeView) | isActiveLegacy;

  return (
    <View
      id="main-nav-analyze"
      label={t('in-components:mainNavigation.viewSwitcherLabelAnalytics')}
      icon="lib_analyze_inverted"
      isActive={isActive}
      //clean this up once all links used here are migrated from observables - use the href prop instead
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
                beaconType: 'sessions',
                groupBy: {}
              })
            ),
          hasInfrastructureAnalyzeAccess && just(getLinkToInfraEntityExplore(defaultInfraExploreViewParams))
        ].filter(Boolean)[0]
      }
      {...props}
    />
  );
}

function WebsiteMobileAppView(props) {
  const { matchLocation, createHrefToPath } = useNavigation();
  const showWebNavigationItem = hasWebsitesAccess;
  const showMobileAppNavigationItem = hasMobileAppsAccess;

  // Converting the new navigation back to observables here
  // in order to avoid too much clutter with isWebsiteAnalyzeView and isMobileAppAnalyzeView.
  // As soon as those two are migrated the observables should be removed!
  const isWebsiteView$ = all(
    just(matchLocation(websiteMonitoringPath)),
    isWebsiteAnalyzeView.map(v => !v)
  );
  const isMobileAppView$ = all(
    just(matchLocation(mobileAppMonitoringPath)),
    isMobileAppAnalyzeView.map(v => !v)
  );

  if (showWebNavigationItem && showMobileAppNavigationItem) {
    return (
      <View
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsitesAndMobileApps')}
        icon="lib_website_mobile_app_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={any(isWebsiteView$, isMobileAppView$)}
        {...props}
      />
    );
  }

  if (showWebNavigationItem) {
    return (
      <View
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsites')}
        icon="lib_website_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={isWebsiteView$}
        {...props}
      />
    );
  }

  if (showMobileAppNavigationItem) {
    return (
      <View
        id="main-nav-mobile-apps"
        label={t('in-components:mainNavigation.viewSwitcherLabelMobileApps')}
        icon="lib_mobile_app_inverted"
        href={createHrefToPath(mobileAppMonitoringPath)}
        isActive$={isMobileAppView$}
        {...props}
      />
    );
  }

  return null;
}

function Platforms(props) {
  const { matchLocation, createHrefToPath } = useNavigation();
  const { expandedSubMenu, setExpandedSubMenu, sidebarIsExpanded, onMouseEnter, onMouseLeave } = props;

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

  const ViewItemForPlatforms = numPlatformsAvailable > 1 ? SubViewItem : View;
  const platforms = (
    <>
      {/* Keep the list of platforms sorted alphabetically */}
      {hasPCFAccess && (
        <ViewItemForPlatforms
          id="main-nav-cloudfoundry"
          label={t('in-components:mainNavigation.viewSwitcherLabelCloudFoundry')}
          icon="lib_cloudfoundry_inverted"
          href={createHrefToPath(cloudfoundryApplicationList)}
          isActive={matchLocation(cloudfoundry)}
          {...props}
        />
      )}
      {hasOpenStackAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-openstack"
          label={t('in-components:mainNavigation.viewSwitcherLabelOpenstack')}
          icon="lib_openstack"
          href={createHrefToPath(regionListFullyQualified)}
          isActive={matchLocation(openstack)}
          {...props}
        />
      )}
      {hasPHMCAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-phmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelphmc')}
          icon="lib_phmc_console"
          href={createHrefToPath(phmcListFullyQualified)}
          isActive={matchLocation(ibmp)}
          {...props}
        />
      )}
      {hasPowerVcAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-powervc"
          label={t('in-components:mainNavigation.viewSwitcherLabelPowervc')}
          icon="lib_powervc"
          href={createHrefToPath(powervcRegionListFullyQualified)}
          isActive={matchLocation(powervc)}
          {...props}
        />
      )}
      {hasZHMCAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-zhmc"
          label={t('in-components:mainNavigation.viewSwitcherLabelzhmc')}
          icon="lib_zhmcConsole"
          href={createHrefToPath(zhmcListFullyQualified)}
          isActive={matchLocation(ibmz)}
          {...props}
        />
      )}
      {hasKubernetesAccess && (
        <ViewItemForPlatforms
          id="main-nav-kubernetes"
          label={t('in-components:mainNavigation.viewSwitcherLabelKubernetes')}
          icon="lib_kubernetes_inverted"
          href={createHrefToPath(kubernetesClusterList)}
          isActive={matchLocation(kubernetes)}
          {...props}
        />
      )}
      {hasSAPAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-sap"
          label={t('in-components:mainNavigation.viewSwitcherLabelSap')}
          icon="lib_sap"
          href={createHrefToPath(sapSystemList)}
          isActive={matchLocation(sap)}
          {...props}
        />
      )}
      {hasVSphereAccess && !playwithEnabled && (
        <ViewItemForPlatforms
          id="main-nav-vsphere"
          label={t('in-components:mainNavigation.viewSwitcherLabelvSphere')}
          icon="lib_vsphere_inverted"
          href={createHrefToPath(datacenterListFullyQualified)}
          isActive={matchLocation(vsphere)}
          {...props}
        />
      )}
    </>
  );

  if (numPlatformsAvailable > 1) {
    const isActive = matchLocation(kubernetes, cloudfoundry, vsphere, ibmz, openstack, ibmp, powervc, sap);

    return (
      <View
        id="main-nav-platforms"
        label={t('in-components:mainNavigation.viewSwitcherLabelPlatforms')}
        icon="lib_platforms_inverted"
        isActive={isActive}
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

function SpacerListItem() {
  return (
    <li>
      {/* double space to get a 1.5rem  */}
      <Spacer vertical="small" />
      <Spacer vertical="small" />
    </li>
  );
}
