/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Nullish } from 'in-types';

const appDataPlugins = ['application', 'service', 'endpoint'];
const websitePlugins = ['website'];
const mobileAppPlugins = ['mobileApp'];
const syntheticPlugins = ['syntheticTest'];
const logPlugins = ['log'];
const oTelDatabasePlugins = ['oTelDatabase'];

export function isAppDataPlugin(plugin: string | Nullish): boolean {
  if (plugin) {
    return appDataPlugins.includes(plugin);
  }
  return false;
}

export function isWebsitePlugin(plugin: string | Nullish): boolean {
  if (plugin) {
    return websitePlugins.includes(plugin);
  }
  return false;
}

export function isSyntheticPlugin(plugin: string | Nullish): boolean {
  if (plugin) {
    return syntheticPlugins.includes(plugin);
  }
  return false;
}

export function isMobileAppPlugin(plugin: string | Nullish): boolean {
  return plugin ? mobileAppPlugins.includes(plugin) : false;
}

export function isLogPlugin(plugin: string | Nullish): boolean {
  return plugin ? logPlugins.includes(plugin) : false;
}

export function isOtelDatabasePlugin(plugin: string | Nullish): boolean {
  return plugin ? oTelDatabasePlugins.includes(plugin) : false;
}
