/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { IpMaskingConfiguration, GeoLocationConfiguration, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getIpMaskingConfiguration(mobileAppId: string): Observable<Result<IpMaskingConfiguration>> {
  return http<IpMaskingConfiguration>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/ip-masking`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function updateIpMaskingConfiguration(
  mobileAppId: string,
  ipMaskingConfiguration: IpMaskingConfiguration
): Observable<Result<IpMaskingConfiguration>> {
  return http<IpMaskingConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/ip-masking`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: ipMaskingConfiguration
  });
}

export function getGeoLocationConfiguration(mobileAppId: string): Observable<Result<GeoLocationConfiguration>> {
  return http<GeoLocationConfiguration>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/geo-location`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function updateGeoLocationConfiguration(
  mobileAppId: string,
  ipMaskingConfiguration: GeoLocationConfiguration
): Observable<Result<GeoLocationConfiguration>> {
  return http<GeoLocationConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/geo-location`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: ipMaskingConfiguration
  });
}
