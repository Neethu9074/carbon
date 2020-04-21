const rp = require('request-promise');

const cache = require('./loadingCache').createLoadingCache({ttl: 1000 * 60 * 5});
const {getGroundskeeperBaseUrl} = require('./config');

// returns Promises. Promise may resolve with null when no unit was found.
// Erroneous promises indicate server problems.
exports.getUnitInfo = (tenant, unit) => {
  return cache('', loadUnits)
    .then(units => units.filter(u => u.tenant === tenant && u.unit === unit)[0]);
};

function loadUnits() {
  return getGroundskeeperBaseUrl()
    .then(baseUrl => {
      if (!baseUrl) {
        const e = new Error('List of units can only be loaded when Groundskeeper is configured in server config.');
        e.ignoreStackTrace = true;
        return Promise.reject(e);
      }

      return rp({
        method: 'GET',
        url: `${baseUrl}/internal/units`,
        json: true,
        simple: true,
        timeout: 5000
      });
    });
}
