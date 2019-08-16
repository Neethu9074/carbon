/* global __HOT_RELOAD__: false */
import { combineLatest } from 'reactive-observables';
import { assign } from 'lodash';

import { tenant, tenantUnitStructure$, user } from 'in-stores/user';
import { registerTracker } from 'in-services/tracking/trackers';
import getCompanyInfo from 'in-subscription/getCompanyInfo';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';

const mixpanel = window.mixpanel;

export function init(callback) {
  if (mixpanel) {
    initMixpanel(callback);
  } else {
    callback(false);
  }
  registerTracker(track);
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
    tenantUnit: config.tenantUnit
  });

  combineLatest([
    tenantUnitStructure$,
    getUsageInfo(),
    getCompanyInfo()
      .map(result => (result && result.data ? result.data : null))
      .filter(Boolean)
  ]).once(([tenantWithUnits, usageInfo, companyInfo]) => {
    mixpanel.register({
      companyName: companyInfo.companyName,
      licenseType: usageInfo && usageInfo.activeLicenseType ? usageInfo.activeLicenseType : null
    });

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
  });
}

function track(event, props) {
  if (mixpanel) {
    mixpanel.track(event, props);
  }
}

export function createDurationTracker(event, defaultProperties = {}) {
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
