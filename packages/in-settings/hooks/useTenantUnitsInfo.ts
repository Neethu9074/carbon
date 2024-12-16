/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import config from 'in-services/config';

export const useTenantUnitsInfo = (): Boolean => {
  const user = window.instana.user;
  const noOfTenants = user?.tenants?.length;
  const noOfUnits = config.tenantUnitsCount;
  if (noOfTenants && noOfTenants > 1) {
    return true;
  } else if (noOfUnits && noOfUnits > 1) {
    return true;
  }
  return false;
};
