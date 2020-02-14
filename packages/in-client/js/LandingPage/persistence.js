import { getSetting$, setSingle, getSingle } from 'in-services/settings/settings';

const settingsKey = 'landingPage';

export function setLandingPage(serializedValue) {
  setSingle(settingsKey, serializedValue);
}

export function getLandingPage$() {
  return getSetting$(settingsKey);
}

export function getLandingPage() {
  return getSingle(settingsKey);
}
