/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { ApplicationSectionFullAccessContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Applications/ApplicationSectionFullAccessContent';
import { ApplicationsSectionContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Applications/ApplicationsSectionContent';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

export const ApplicationsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess } = getAreaData({
    area: ProductArea.APPLICATION,
    permissionsSet
  });

  if (hasFullAreaAccess && !permissionsSet.restrictedApplicationFilter) return <ApplicationSectionFullAccessContent />;
  return <ApplicationsSectionContent />;
};
