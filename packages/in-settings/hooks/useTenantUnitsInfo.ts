/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';

import { Disposable } from '@instana/observables';

import { getTenantsWithUnits } from 'in-api/account';
import config from 'in-services/config';

export interface TenantUnitsInfo {
  tenantInfoLoading: boolean;
  showTenantInfo: boolean;
}

export let cache: boolean | null = null;

export const useTenantUnitsInfo = (): TenantUnitsInfo => {
  const [tenantInfoLoading, setTenantInfoLoading] = useState(true);
  const [showTenantInfo, setShowTenantInfo] = useState(false);

  useEffect(() => {
    let disposable: Disposable;

    if (cache != null) {
      setShowTenantInfo(cache);
      setTenantInfoLoading(false);
    } else {
      const result$ = getTenantsWithUnits();

      disposable = result$.once(data => {
        setTenantInfoLoading(false);
        const noOfTenants = Object.keys(data)?.length;
        const noOfUnits = data[config.tenant]?.length;

        if ((noOfTenants && noOfTenants > 1) || (noOfUnits && noOfUnits > 1)) {
          setShowTenantInfo(true);
          cache = true;
        } else {
          setShowTenantInfo(false);
          cache = false;
        }
      });
    }
    return () => {
      disposable?.dispose();
    };
  }, []);

  return { tenantInfoLoading, showTenantInfo };
};

export const clearCache = () => {
  cache = null;
};

export const setCache = (cachedData: boolean) => {
  cache = cachedData;
};
