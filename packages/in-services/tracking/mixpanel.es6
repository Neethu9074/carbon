import { assign } from 'lodash';

import { getTenantsWithUnits } from 'in-api/account';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

const mixpanel = window.mixpanel;
const sharedTransmitterProperties = {
  token: config.mixpanelToken
};
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
  // PM decided to go with option (c) so we do not need to get explicit content from each user, implement opt-in/opt-out
  // and change all our data processing agreements with customers. This, however, will break some Mixpanel reports (as
  // explained in the the link given for option c).
  mixpanel.identify('anonymous');

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
  if (!mixpanel || !config.mixpanelToken) {
    return noop;
  }
  return props => mixpanel.track(event, assign({}, props, defaultProperties, sharedTransmitterProperties));
}

export function createDurationTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel || !config.mixpanelToken) {
    return {
      start: noop,
      stop: noop
    };
  }

  return {
    start: () => mixpanel.time_event(event),
    stop: props => mixpanel.track(event, assign({}, props, defaultProperties, sharedTransmitterProperties))
  };
}
