import { combineLatest } from '@instana/observables';
import { assign } from 'lodash';

import { tenant, tenantUnitStructure$, user } from 'in-stores/user';
import { registerTracker } from 'in-services/tracking/trackers';
import getUsageInfo from 'in-subscription/getUsageInfo';
import getAccount from 'in-subscription/getAccount';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import config from 'in-services/config';

export function init() {
  if (window.mixpanel) {
    initMixpanel();
  }
  registerTracker(track);
}

function initMixpanel() {
  const userSelfDefinedRole =
    window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;

  // We send the GK user ID , which avoids GDPR issues and does not require explicit consent because
  // we do not send personal information (like email adress or the user's name) to third parties.
  window.mixpanel.identify(user.id);
  window.mixpanel.people.set({
    $id: user.id,
    last_page_load: new Date(),
    userSelfDefinedRole
  });

  const tenants = [];

  const tenantList = user.tenants || [];
  for (let i = 0; i < tenantList.length; i++) {
    const tenant = tenantList[i];
    tenants[i] = tenant.name;
  }

  window.mixpanel.register({
    tenant: tenant.name,
    tenantId: tenant.id,
    tenantUnit: config.tenantUnit,
    tenants,
    userSelfDefinedRole
  });

  combineLatest([
    tenantUnitStructure$,
    getUsageInfo(),
    getAccount()
      .map(result => (result && result.data ? result.data : null))
      .filter(Boolean)
  ]).once(([tenantWithUnits, usageInfo, account]) => {
    window.mixpanel.register({
      companyId: account.id,
      companyName: account.name,
      licenseType: usageInfo?.activeLicenseType
    });

    const units = tenantWithUnits[tenant.name];
    if (!units) {
      return;
    }

    const currentUnit = find(units, unit => unit.name === config.tenantUnit);
    if (currentUnit) {
      window.mixpanel.register({
        tenantUnitId: currentUnit.id
      });
    }
  });
}

function track(event, props) {
  if (window.mixpanel) {
    window.mixpanel.track(event, props);
  }
}

export function createDurationTracker(event, defaultProperties = {}) {
  if (!window.mixpanel) {
    return {
      start: noop,
      stop: noop
    };
  }

  return {
    start: () => window.mixpanel.time_event(event),
    stop: props => window.mixpanel.track(event, assign({}, props, defaultProperties))
  };
}
