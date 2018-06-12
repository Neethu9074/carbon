import { assign } from 'lodash';

import { getTenantsWithUnits } from 'in-api/account';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { tenant, user } from 'in-stores/user';
import { config } from 'in-services/config';

const mixpanel = window.mixpanel;
const registeredTrackers = [];

export function init() {
  if (mixpanel) {
    initMixpanel();
    return true;
  }
  return false;
}

function initMixpanel() {
  // Possible options for anonymizing or identifying users for mixpanel tracking:
  // a) Sending either the GK user ID () or the email address.
  //    mixpanel.identify(user.id)/mixpanel.identify(user.email)
  // b) Do not send email or user ID, instead, omit the mixpanel.identify call completely. In this case, Mixpanel will
  //    then generate its own ID and keep it persistent via a Cookie for individual users (per device/browser).
  // c) Truly anonymize all actions by setting the same fixed, hard coded distinct ID for all Mixpanel tracking calls,
  //    see https://help.mixpanel.com/hc/en-us/articles/360000791746-Tracking-Truly-Anonymous-Data, section
  //    "Send the Same Distinct_id for All Events".
  //    mixpanel.identify('some-arbitrary-but-fixed-string');
  // PM decided to go with option a/GK user ID, which still avoids GDPR and does not require explicit consent because
  // we do not send personal information (like email adress or user name) to third parties.
  mixpanel.identify(user.id);

  mixpanel.register({
    tenantId: tenant.id
  });
  getTenantsWithUnits().once(
    tenantWithUnits => {
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
    },
    () => {
      /* suppress "unhandled error in observable chain" message when tenant unit cannot be fetched */
    }
  );

  // give getTenantsWithUnits a chance to complete before logging the page load/page reload event
  setTimeout(() => {
    mixpanel.track('pageLoadOrPageReload');
  }, 10000);
}

export function createTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel) {
    return noop;
  }
  return props => mixpanel.track(event, assign({}, props, defaultProperties));
}

export function createDurationTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
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
