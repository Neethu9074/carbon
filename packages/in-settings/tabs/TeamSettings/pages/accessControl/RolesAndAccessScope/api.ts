/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, MobileAppConfiguration, WebsiteConfiguration } from '@instana/types';
import { Observable } from '@instana/observables';

import { getMobileAppConfigurations } from 'in-mobile-apps/api/mobileApps';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { compareIgnoreCase } from 'in-services/util/string';
import { deepCopy } from 'in-services/util/object';

export function getSortedMobileAppConfigurations(): Observable<Result<MobileAppConfiguration[]>> {
  return getMobileAppConfigurations().map(({ data, ...rest }) => {
    const newData = data ? deepCopy(data) : [];
    return {
      data: newData.sort((a, b) => compareIgnoreCase(a.name, b.name)),
      ...rest
    };
  });
}

export function getSortedWebsiteConfigurations(): Observable<Result<WebsiteConfiguration[]>> {
  return getWebsiteConfigurations().map(({ data, ...rest }) => {
    const newData = data ? deepCopy(data) : [];
    return {
      data: newData.sort((a, b) => compareIgnoreCase(a.name, b.name)),
      ...rest
    };
  });
}
