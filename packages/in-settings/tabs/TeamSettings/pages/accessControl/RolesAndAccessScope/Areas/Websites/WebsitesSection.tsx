/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { WebsiteSectionFullAccessContent } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Websites/WebsiteSectionFullAccessContent';
import { WebsiteSectionContent } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Websites/WebsiteSectionContent';
import { getAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';

export const WebsitesSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess, shouldRenderContent } = getAreaData({ area: ProductArea.WEBSITE, permissionsSet });

  if (!shouldRenderContent) return null;

  if (hasFullAreaAccess) return <WebsiteSectionFullAccessContent />;

  return <WebsiteSectionContent />;
};
