/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { MobileSectionFullAccessContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileSectionFullAccessContent';
import { MobileAppsSectionContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileAppsSectionContent';
import {
  applicationsAccessPermissions,
  mobileAppsAccessPermissions,
  websitesAccessPermissions
} from 'in-stores/permission';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import useHasAccess from 'in-stores/useHasAccess';

export const MobileAppsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const hasApplicationsAccess = useHasAccess({ requiredPermissions: applicationsAccessPermissions });
  const hasMobileAppsAccess = useHasAccess({ requiredPermissions: mobileAppsAccessPermissions });
  const hasWebsitesAccess = useHasAccess({ requiredPermissions: websitesAccessPermissions });
  const { hasFullAreaAccess } = getAreaData({
    area: ProductArea.MOBILE_APP,
    permissionsSet,
    hasApplicationsAccess,
    hasMobileAppsAccess,
    hasWebsitesAccess
  });

  if (hasFullAreaAccess) return <MobileSectionFullAccessContent />;

  return <MobileAppsSectionContent />;
};
