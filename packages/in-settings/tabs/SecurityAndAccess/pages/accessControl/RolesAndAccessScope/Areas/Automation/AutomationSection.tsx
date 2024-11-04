/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { AutomationFullAccessContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Automation/AutomationSectionFullAccessContent';
import { AutomationSectionContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Automation/AutomationSectionContent';
import { getAutomationAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAutomationAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

export const AutomationSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess } = getAutomationAreaData({
    area: ProductArea.AUTOMATION,
    permissionsSet
  });

  if (hasFullAreaAccess) return <AutomationFullAccessContent />;

  return <AutomationSectionContent />;
};
