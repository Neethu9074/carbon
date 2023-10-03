/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSet } from '@instana/types';
import { Ul } from '@instana/components';

import { EventsAndAlertsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/EventsAndAlerts/EventsAndAlertsSection';
import { GlobalFunctionsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/GlobalFunctions/GlobalFunctionsSection';
import { InfrastructureSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Infrastructure/InfrastructureSection';
import { ApplicationsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Applications/ApplicationsSection';
import { MobileAppsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileAppsSection';
import { AnalyticsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Analytics/AnalyticsSection';
import { PlatformsSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/PlatformsSection';
import { WebsitesSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Websites/WebsitesSection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { SyntheticMonitoringSection } from './SyntheticMonitoring/SyntheticMonitoringSection';
import { syntheticRbacEnabled } from 'in-services/featureFlags';

interface RolesAndAccessScopeOverviewProps {
  permissionsSet: PermissionSet;
}

export default function RolesAndAccessScopeOverview({ permissionsSet }: RolesAndAccessScopeOverviewProps) {
  return (
    <Ul>
      <RolesAndAccessScopeContext.Provider value={{ permissionsSet: permissionsSet }}>
        <WebsitesSection />
        <MobileAppsSection />
        <ApplicationsSection />
        <PlatformsSection />
        <InfrastructureSection />
        {syntheticRbacEnabled && <SyntheticMonitoringSection />}
        <AnalyticsSection />
        <EventsAndAlertsSection />
        <GlobalFunctionsSection />
      </RolesAndAccessScopeContext.Provider>
    </Ul>
  );
}
