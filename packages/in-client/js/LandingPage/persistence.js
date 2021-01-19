/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getSetting$, setSingle, getSingle } from 'in-services/settings/perUnitSettings';

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
