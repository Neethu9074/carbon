/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export interface ClientConfig {
  featureFlags: {
    [name: string]: boolean;
  };
  instanaRegion: string;
  region: string;
  tenant: string;
  tenantUnit: string;
}

export interface BuildInfo {
  date: string;
  revision: string;
  tag: string;
}

// @ts-ignore
const theConfig: ClientConfig = window.instana.config;

export default theConfig;

export const config = theConfig;
export const baseUrl = window.location.origin;
// @ts-ignore
export const build: BuildInfo = window.instana.build;
export const region = theConfig.region;
export const instanaRegion = theConfig.instanaRegion;

export function isFeatureFlagEnabled(ff: string, fallback = false) {
  if (config.featureFlags == null || config.featureFlags[ff] == null) {
    return fallback;
  }
  return config.featureFlags[ff] === true;
}
