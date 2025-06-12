/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { keyCodes, MenuItem, UIShell } from '@instana/components';

import { click as internalToggleClick } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import SyntheticMonitoringMenuItem from 'in-client/js/CarbonUIShell/SyntheticMonitoringMenuItem';
import CustomDashboardsMenuItem from 'in-client/js/CarbonUIShell/CustomDashboardsMenuItem';
import ProfileMenu from 'in-components/MainNavigation/components/ProfileMenu/ProfileMenu';
import VulnerabilitiesMenuItem from 'in-client/js/CarbonUIShell/VulnerabilitiesMenuItem';
import InfrastructureMenuItem from 'in-client/js/CarbonUIShell/InfrastructureMenuItem';
import ServiceLevelsMenuItem from 'in-client/js/CarbonUIShell/ServiceLevelsMenuItem';
import ApplicationsMenuItem from 'in-client/js/CarbonUIShell/ApplicationsMenuItem';
import WebsiteMobileAppView from 'in-client/js/CarbonUIShell/WebsiteMobileAppView';
import AutomationMenuItem from 'in-client/js/CarbonUIShell/AutomationMenuItem';
import AnalyticsMenuItem from 'in-client/js/CarbonUIShell/AnalyticsMenuItem';
import PlatformsMenuItem from 'in-client/js/CarbonUIShell/PlatformsMenuItem';
import SettingsMenuItem from 'in-client/js/CarbonUIShell/SettingsMenuItem';
import HomeLinkMenuItem from 'in-client/js/CarbonUIShell/HomeLinkMenuItem';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useUIShellTitleDetail from 'in-plg/hooks/useUIShellTitleDetail';
import BizOpsMenuItem from 'in-client/js/CarbonUIShell/BizOpsMenuItem';
import EventsMenuItem from 'in-client/js/CarbonUIShell/EventsMenuItem';
import LogsMenuItem from 'in-client/js/CarbonUIShell/LogsMenuItem';
import MoreMenuItem from 'in-client/js/CarbonUIShell/MoreMenuItem';
import { playwithEnabled } from 'in-services/featureFlags';
import Header from 'in-client/js/CarbonUIShell/Header';
import { t } from 'in-i18n';

const { isEscape } = keyCodes;

export default function CarbonUIShell() {
  const { location } = useNavigation();
  const titleDetail = useUIShellTitleDetail();
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  const onClickSideNavExpand = () => setIsHeaderExpanded(!isHeaderExpanded);

  // If header panel is open, and user clicks outside, close it
  const handleKeyPress = (event: KeyboardEvent) => {
    if (isEscape(event)) {
      setIsHeaderExpanded(false);
    }
  };
  const handleClickOutside = (event: MouseEvent) => {
    const focusedElement = document.activeElement as HTMLElement;
    const isPanelContent = focusedElement?.closest('.cds--header-panel--expanded');
    const isHeaderAction = focusedElement?.closest('.cds--header__action');
    const switcherButton = document.getElementById('profileMenu-switcher');
    const isProfileMenuSwitcher = switcherButton?.contains(event.target as Node);

    if (!isPanelContent && !isHeaderAction && !isProfileMenuSwitcher) {
      setIsHeaderExpanded(false);
    }
  };

  // Add event listener for outside of header panel clicks
  useEffect(() => {
    if (isHeaderExpanded) {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('keydown', handleKeyPress, true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [isHeaderExpanded]);

  useEffect(() => {
    // @ts-expect-error ibmStats is not present in window type.
    window?.ibmStats?.pageview();
  }, [location]);

  return (
    <UIShell
      skipToContentText={t('in-components:mainNavigation.skipToMainContent')}
      onSideNavClick={internalToggleClick}
      titleDetail={titleDetail}
      headerContent={<Header expanded={isHeaderExpanded} onClickSideNavExpand={onClickSideNavExpand} />}
      headerPanelContent={
        <ProfileMenu isSideNavExpanded={isHeaderExpanded} onClickSideNavExpand={onClickSideNavExpand} />
      }
      headerPanelExpanded={isHeaderExpanded}
    >
      <HomeLinkMenuItem />
      <WebsiteMobileAppView />
      <BizOpsMenuItem />
      <ApplicationsMenuItem />
      <PlatformsMenuItem />
      <InfrastructureMenuItem />
      <MenuItem isDivider />
      <CustomDashboardsMenuItem />
      <LogsMenuItem />
      <SyntheticMonitoringMenuItem />
      <AnalyticsMenuItem />
      <VulnerabilitiesMenuItem />
      <EventsMenuItem />
      <AutomationMenuItem />
      <ServiceLevelsMenuItem />
      <MenuItem isDivider />
      <SettingsMenuItem />
      {!playwithEnabled && <MoreMenuItem />}
    </UIShell>
  );
}
