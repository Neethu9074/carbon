/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

const serverConfig = require('../serverConfig.js');
const fetch = require('./fetch');

exports.getTenantInfoFromUiBackend = async (req, tenant, unitName) => {
  try {
    const response = await fetch(`${req.uiBackendBaseUrl}/api/settings/rbac/user/tenants`, {
      headers: {
        Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      },
      timeout: 15000
    });

    if (!response.ok) {
      req.log.error(`Could not load internal ids from uiBackend. Got status: %s`, response.status);
      throw new Error(`Failed to fetch internal ids: ${response.status}`);
    }

    const tenantWithUnits = await response.json();

    if (tenantWithUnits) {
      const units = tenantWithUnits[tenant];
      if (!units) {
        return;
      }
      const currentUnit = units.find(unit => unit.tenantUnitName === unitName);
      return {
        tenantUnitId: currentUnit.tenantUnitId,
        tenantId: currentUnit.tenantId,
        tenantUnitsCount: units.length
      };
    }

    req.log.error('Failed reading internal ids.');
  } catch (err) {
    req.log.error({ err }, `Could not load internal ids from uiBackend. Got error`);
  }
};
