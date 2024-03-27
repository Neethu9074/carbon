/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { combineLatest } from '@instana/observables';

//@ts-expect-error
import { Segment, commonProperties } from 'in-services/tracking/segment/SegmentInit';
import { customRealmName } from 'in-services/util/constants';
import { playwithEnabled } from 'in-services/featureFlags';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { getTenantsWithUnits } from 'in-api/account';
import { TenantsWithUnits } from 'in-api/account';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

interface SegmentEventTrackerProps {
  parentProductArea: string;
  parentPageName: string;
}

interface currentUnitProps {
  tenantUnitId: string;
  tenantUnitName: string;
  tenantName: string;
}

interface combineLatestProps {
  tenantWithUnits: TenantsWithUnits;
  usageInfo: UsageInfoProps;
}

let productPlanType: string;
let instanceId: string;
let tenantName: string;
let tenantUnitName: string;
let userId: string;
interface UsageInfoProps {
  activeLicenseType: string;
}
const segment = Segment();
const PageTracker = ({ parentProductArea, parentPageName }: SegmentEventTrackerProps) => {
  useEffect(() => {
    if (!playwithEnabled) {
      return;
    }
    if (!segment) {
      return;
    }

    const url = window.location.href;
    const path = window.location.pathname;

    combineLatest([getTenantsWithUnits(), getUsageInfo({})]).once(response => {
      const responseWithType = response as unknown as combineLatestProps;
      productPlanType = getLicenseTypeForSegment(responseWithType.usageInfo?.activeLicenseType);
      const units: any = responseWithType.tenantWithUnits[tenant?.name!];

      if (!units) {
        return;
      }
      const currentUnit: currentUnitProps = find(units, unit => unit.tenantUnitName === config.tenantUnit)!;
      if (currentUnit) {
        instanceId = currentUnit.tenantUnitId;
        tenantUnitName = currentUnit.tenantUnitName;
        tenantName = currentUnit.tenantName;
      }
      userId = customRealmName + '-' + instanceId;
      segment.page('', parentPageName, {
        url,
        path,
        parentProductArea,
        parentPageName,
        productPlanType,
        instanceId,
        userId,
        tenantName,
        tenantUnitName,
        commonProperties
      });
    });
  }, [parentProductArea, parentPageName]);
  return null; // SegmentEventTracker does not render anything

  function getLicenseTypeForSegment(currentActiveLicense: string) {
    switch (currentActiveLicense) {
      case 'selfService':
        return 'trial';
      case 'quota':
        return 'POC';
      case 'free_not_for_resale':
        return 'NFR';
      case 'paidPerUse':
      case 'hostBasedPaid':
        return 'subscription';
      case 'paid-paygo':
        return 'paygo';
      default:
        return currentActiveLicense;
    }
  }
};

export default PageTracker;
