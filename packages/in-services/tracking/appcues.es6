import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import { config } from 'in-services/config';
import { user, role } from 'in-stores/user';

const featureFlagPrefix = 'featureFlag.';

let Appcues;

// extra targeting properties which are asynchronously loaded
const extraTargetingProperties = {};

export function init() {
  if (window.Appcues) {
    onAppcuesLoaded();
  } else {
    // We want to load appcues in a non-blocking way. Also, Appcues does not provide a mechanism to be informed when
    // the API is ready. So we need to do this manually.
    // The script may not be referenced in the document when we didn't specify an appcuesId during deployment time,
    // e.g. for onprem.
    const script = document.getElementById('appcuesScript'); // see index.hbs for source of ID
    if (script) {
      script.addEventListener('load', onAppcuesLoaded, false);
    }
  }
}

export function onRouteChange() {
  if (Appcues) {
    // appcues need to be informed about SPA navigations. See:
    // https://docs.appcues.com/article/161-javascript-api
    Appcues.page();
  }
}

function onAppcuesLoaded() {
  Appcues = window.Appcues;
  identify();
}

function identify() {
  if (!Appcues) {
    return;
  }

  const targetingProperties = {
    ...extraTargetingProperties,

    tenant: config.tenant,
    unit: config.tenantUnit,

    // Tours that want to highlight the availability of app 2.0 or other features will need to
    // know whether the respective feature is enabled.
    // We are using a subset of all available feature flags, because a bunch of feature flags
    // only make sense internally.
    [`${featureFlagPrefix}isTwoZeroBetaPhase`]: isTwoZeroBetaPhase,
    [`${featureFlagPrefix}twoZeroModeEnabled`]: twoZeroModeEnabled
  };

  // In order to target users, we need to know about the permissions that a user has.
  // For example, it only makes sense to start a tour for the creation of an application,
  // when the user actually has the permission to create applications.
  Object.keys(role).forEach(key => (targetingProperties[`role.${key}`] = role[key]));

  Appcues.identify(user.id, targetingProperties);
}

export function reportLicenseType(licenseType) {
  extraTargetingProperties.activeLicenseType = licenseType;
  identify();
}
