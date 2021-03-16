/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;
export const baseUrl = window.location.origin;
export const build = window.instana.build;
export const region = theConfig.region;
export const instanaRegion = theConfig.instanaRegion;

export function isFeatureFlagEnabled(ff, fallback = false) {
  if (config.featureFlags == null || config.featureFlags[ff] == null) {
    return fallback;
  }
  return config.featureFlags[ff] === true;
}
