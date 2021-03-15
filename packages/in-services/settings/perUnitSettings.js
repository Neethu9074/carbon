/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  getSetting$ as getSettingGlobal$,
  setSingle as setSingleGlobal,
  getSingle as getSingleGlobal
} from 'in-services/settings/settings';
import config from 'in-services/config';

const settingsPrefix = `perUnit.${config.tenant}-${config.tenantUnit}.`;

export function getSetting$(key) {
  return getSettingGlobal$(settingsPrefix + key);
}

export function setSingle(key, value) {
  return setSingleGlobal(settingsPrefix + key, value);
}

export function getSingle(key) {
  return getSingleGlobal(settingsPrefix + key);
}
