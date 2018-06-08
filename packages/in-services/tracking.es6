import { assign } from 'lodash';

import { getTenantsWithUnits } from 'in-api/account';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { tenant, user } from 'in-stores/user';
import { config } from 'in-services/config';

const mixpanel = window.mixpanel;
const sharedTransmitterProperties = {
  token: config.mixpanelToken
};
const registeredTrackers = [];

export function init() {
  if (mixpanel) {
    mixpanel.identify(user.id);
    mixpanel.register({
      tenantId: tenant.id
    });
    getTenantsWithUnits().once(tenantWithUnits => {
      const units = tenantWithUnits[tenant.name];
      if (!units) {
        return;
      }
      const currentUnit = find(units, unit => (unit.name = config.tenantUnit));
      if (!currentUnit) {
        return;
      }
      mixpanel.register({
        tenantUnitId: currentUnit.id
      });
    });

    // give getTenantsWithUnits a chance to complete before logging the page load/page reload event
    // TODO Add mixpanel to butler to count actual successful sign ins?
    setTimeout(() => {
      mixpanel.track('pageLoadOrPageReload');
    }, 5000);
  }
}

export function createTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel || !config.mixpanelToken) {
    return noop;
  }
  return props => mixpanel.track(event, assign({}, props, defaultProperties, sharedTransmitterProperties));
}
