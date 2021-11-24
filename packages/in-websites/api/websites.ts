/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  SourceMapDownloadConfig,
  SourceMapDownloadConfigs,
  WebsiteConfiguration,
  IpMaskingConfiguration,
  GeoLocationConfiguration,
  Result
} from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { compareIgnoreCase } from 'in-services/util/string';
import http, { Response } from 'in-services/http';

export function getWebsites(): Observable<WebsiteConfiguration[]> {
  return http<WebsiteConfiguration[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config`
  }).map(response => {
    const keys = response.body || [];
    keys.sort((a, b) => compareIgnoreCase(a.name, b.name));
    return keys;
  });
}

export function removeWebsite(id: string): Observable<never> {
  return http<never>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addWebsite(name: string): Observable<WebsiteConfiguration> {
  return http<WebsiteConfiguration>({
    method: 'POST',
    url: `/api/website-monitoring/config`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response.body);
}

export function renameWebsite(id: string, name: string): Observable<Response<WebsiteConfiguration>> {
  return http<WebsiteConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response);
}

export function getSourceMapConfigurations(id: string): Observable<SourceMapDownloadConfigs> {
  return http<SourceMapDownloadConfigs>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}/sourceMap`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addSourceMapConfiguration(
  websiteId: string,
  config: SourceMapDownloadConfig
): Observable<SourceMapDownloadConfig> {
  return http<SourceMapDownloadConfig>({
    method: 'POST',
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function updateSourceMapConfiguration(
  websiteId: string,
  config: SourceMapDownloadConfig
): Observable<SourceMapDownloadConfig> {
  return http<SourceMapDownloadConfig>({
    method: 'PUT',
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap/${encodeURIComponent(config.id)}`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function removeSourceMapConfiguration(websiteId: string, sourceMapConfigId: string): Observable<never> {
  return http<never>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap/${encodeURIComponent(
      sourceMapConfigId
    )}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function getIpMaskingConfiguration(websiteId: string): Observable<Result<IpMaskingConfiguration>> {
  return http<IpMaskingConfiguration>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/ip-masking`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function updateIpMaskingConfiguration(
  websiteId: string,
  ipMaskingConfiguration: IpMaskingConfiguration
): Observable<Result<IpMaskingConfiguration>> {
  return http<IpMaskingConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/ip-masking`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: ipMaskingConfiguration
  });
}

export function getGeoLocationConfiguration(websiteId: string): Observable<Result<GeoLocationConfiguration>> {
  return http<GeoLocationConfiguration>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/geo-location`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function updateGeoLocationConfiguration(
  websiteId: string,
  ipMaskingConfiguration: GeoLocationConfiguration
): Observable<Result<GeoLocationConfiguration>> {
  return http<GeoLocationConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/geo-location`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: ipMaskingConfiguration
  });
}
