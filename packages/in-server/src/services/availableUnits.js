/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const cache = require('./loadingCache').createLoadingCache({ ttl: 1000 * 60 * 5 });
const { getGroundskeeperBaseUrl } = require('./config');
const fetch = require('./fetch');

// Returns Promises. Promise may resolve with null when no unit was found.
// Erroneous promises indicate server problems.
exports.getUnitInfo = async (tenant, unit) => {
  const units = await cache('', loadUnits);
  return units.filter(u => u.tenant === tenant && u.unit === unit)[0];
};

async function loadUnits() {
  const baseUrl = await getGroundskeeperBaseUrl();
  const url = `${baseUrl}/internal/units`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to provide unit list: Retrieved status code ${response.status} for GET ${url}.`);
  }

  const body = await response.text();
  return JSON.parse(body);
}
