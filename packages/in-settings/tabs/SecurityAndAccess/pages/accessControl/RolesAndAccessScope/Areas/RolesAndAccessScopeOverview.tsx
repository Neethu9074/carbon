/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSet } from '@instana/types';
import { Ul } from '@instana/components';

import { SyntheticMonitoringSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/SyntheticMonitoring/SyntheticMonitoringSection';
import { BusinessMonitoringSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/BusinessMonitoring/BusinessMonitoringSection';
import { GlobalFunctionsSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/GlobalFunctions/GlobalFunctionsSection';
import { InfrastructureSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Infrastructure/InfrastructureSection';
import { ApplicationsSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Applications/ApplicationsSection';
import { MobileAppsSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileAppsSection';
import { AutomationSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Automation/AutomationSection';
import { PlatformsSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/PlatformsSection';
import { WebsitesSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Websites/WebsitesSection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { actionAutomationEnabled, syntheticsEnabled } from 'in-services/featureFlags';

interface RolesAndAccessScopeOverviewProps {
  permissionsSet: PermissionSet;
}

export default function RolesAndAccessScopeOverview({ permissionsSet }: RolesAndAccessScopeOverviewProps) {
  return (
    <Ul>
      <RolesAndAccessScopeContext.Provider value={{ permissionsSet: permissionsSet }}>
        <WebsitesSection />
        <MobileAppsSection />
        <BusinessMonitoringSection />
        <ApplicationsSection />
        <PlatformsSection />
        <InfrastructureSection />
        {syntheticsEnabled && <SyntheticMonitoringSection />}
        {actionAutomationEnabled && <AutomationSection />}
        <GlobalFunctionsSection />
      </RolesAndAccessScopeContext.Provider>
    </Ul>
  );
}
