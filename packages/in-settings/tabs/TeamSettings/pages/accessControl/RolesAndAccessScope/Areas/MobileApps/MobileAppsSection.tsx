/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { MobileSectionFullAccessContent } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileSectionFullAccessContent';
import { MobileAppsSectionContent } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/MobileAppsSectionContent';
import { getAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';

export const MobileAppsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess, shouldRenderContent } = getAreaData({
    area: ProductArea.MOBILE_APP,
    permissionsSet
  });

  if (!shouldRenderContent) return null;

  if (hasFullAreaAccess) return <MobileSectionFullAccessContent />;

  return <MobileAppsSectionContent />;
};
