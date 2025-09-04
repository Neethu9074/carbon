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
import { syntheticsAccessPermissions } from 'in-stores/permission';
import { syntheticsEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';

export const SyntheticMonitoringSection = () => {
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasFullAreaAccess } = getSyntheticAreaData({
    area: ProductArea.SYNTHETICS,
    permissionsSet,
    hasSyntheticsAccess
  });

  if (hasFullAreaAccess) return <SyntheticMonitoringSectionFullAccessContent />;

  return <SyntheticMonitoringSectionContent />;
};
