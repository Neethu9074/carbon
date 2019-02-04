/* global __HOT_RELOAD__: false */
import { assign } from 'lodash';

import { tenant, tenantUnitStructure$, user } from 'in-stores/user';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { ineum } from 'in-services/eum';

const mixpanel = window.mixpanel;
const registeredTrackers = [];

export function init(callback) {
  if (mixpanel) {
    initMixpanel(callback);
  } else {
    callback(false);
  }
}

function initMixpanel(callback) {
  // We send the GK user ID , which avoids GDPR issues and does not require explicit consent because
  // we do not send personal information (like email adress or the user's name) to third parties.
  mixpanel.identify(user.id);
  mixpanel.people.set({
    $id: user.id,
    last_page_load: new Date()
  });

  mixpanel.register({
    tenant: tenant.name,
    tenantId: tenant.id,
    tenantUnit: config.tenantUnit,
    email: user.email
  });
  tenantUnitStructure$.once(
    tenantWithUnits => {
      const units = tenantWithUnits[tenant.name];
      if (!units) {
        return callback(true);
      }
      const currentUnit = find(units, unit => unit.name === config.tenantUnit);
      if (!currentUnit) {
        return callback(true);
      }
      mixpanel.register({
        tenantUnitId: currentUnit.id
      });
      return callback(true);
    },
    () => {
      return callback(true);
    }
  );
}

export function createTracker(event, defaultProperties = {}) {
  const alreadyRegistered = registeredTrackers.indexOf(event) >= 0;
  if (__HOT_RELOAD__ && alreadyRegistered) {
    return noop;
  } else if (alreadyRegistered) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel) {
    return noop;
  }
  return props => {
    const eventProps = assign({}, props, defaultProperties);
    ineum('reportEvent', event, {
      meta: eventProps
    });
    mixpanel.track(event, eventProps);
  };
}

export function createDurationTracker(event, defaultProperties = {}) {
  const alreadyRegistered = registeredTrackers.indexOf(event) >= 0;
  if (__HOT_RELOAD__ && alreadyRegistered) {
    return noop;
  } else if (alreadyRegistered) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel) {
    return {
      start: noop,
      stop: noop
    };
  }

  return {
    start: () => mixpanel.time_event(event),
    stop: props => mixpanel.track(event, assign({}, props, defaultProperties))
  };
}
