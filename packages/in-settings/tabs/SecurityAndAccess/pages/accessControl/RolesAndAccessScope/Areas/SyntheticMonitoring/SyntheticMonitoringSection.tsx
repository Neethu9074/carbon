/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { SyntheticMonitoringSectionFullAccessContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/SyntheticMonitoring/SyntheticMonitoringSectionFullAccessContent';
import { SyntheticMonitoringSectionContent } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/SyntheticMonitoring/SyntheticMonitoringSectionContent';
import { getSyntheticAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getSyntheticAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

export const SyntheticMonitoringSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess } = getSyntheticAreaData({
    area: ProductArea.SYNTHETICS,
    permissionsSet
  });

  if (hasFullAreaAccess) return <SyntheticMonitoringSectionFullAccessContent />;

  return <SyntheticMonitoringSectionContent />;
};
