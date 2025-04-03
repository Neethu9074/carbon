/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export interface ClientConfig {
  urlFormatPathStyle?: boolean;
  featureFlags: {
    [name: string]: boolean;
  };
  instanaRegion: string;
  tenantUnitDomainSuffix: string;
  region: string;
  tenant: string;
  tenantUnit: string;
  tenantId: string;
  tenantUnitId: string;
  tenantUnitsCount: number;
  agentEndpoint?: string;
  agentEndpointPort?: string;
  agentInstallDomain?: string;
  butlerDomain?: string;
  solisUiHost?: string;
  integrationBaseUrl?: string;
  serverlessEndpoint?: string;
  websiteScriptSource?: string;
  websiteEndpoint?: string;
  activeLicenseType: string;
  // this is injected or set with in a build step in build/gulp/build.js
  amplitudeKey: string;
}

export interface BuildInfo {
  date: string;
  revision: string;
  tag: string;
}

// @ts-expect-error
const theConfig: ClientConfig = window.instana.config;

export default theConfig;

export const config = theConfig;
export const baseUrl = window.location.origin;
// @ts-expect-error
export const build: BuildInfo = window.instana.build;
export const region = theConfig.region;
export const instanaRegion = theConfig.instanaRegion;

export function isFeatureFlagEnabled(ff: string, fallback = false) {
  if (config.featureFlags == null || config.featureFlags[ff] == null) {
    return fallback;
  }
  return config.featureFlags[ff] === true;
}
