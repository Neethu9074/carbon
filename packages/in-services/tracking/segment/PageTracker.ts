/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { combineLatest } from '@instana/observables';

//@ts-expect-error
import { Segment, commonProperties } from 'in-services/tracking/segment/SegmentInit';
import { playwithEnabled } from 'in-services/featureFlags';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { getTenantsWithUnits } from 'in-api/account';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

interface SegmentEventTrackerProps {
  parentProductArea: string;
  parentPageName: string;
}

let productPlanType: string;
let instanceId: string;
let tenantName: string;
let tenantUnitName: string;

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

    combineLatest([
      getTenantsWithUnits(),
      //@ts-expect-error
      getUsageInfo()
    ]).once(([tenantWithUnits, usageInfo]) => {
      //@ts-expect-error
      productPlanType = getLicenseTypeForSegment(usageInfo?.activeLicenseType);
      //@ts-expect-error
      const units = tenantWithUnits[tenant.name];

      if (!units) {
        return;
      }
      //@ts-expect-error
      const currentUnit = find(units, unit => unit.tenantUnitName === config.tenantUnit);
      if (currentUnit) {
        //@ts-expect-error
        instanceId = currentUnit.tenantUnitId;
        //@ts-expect-error
        tenantUnitName = currentUnit.tenantUnitName;
        //@ts-expect-error
        tenantName = currentUnit.tenantName;
      }
      segment.page('', parentPageName, {
        url,
        path,
        parentProductArea,
        parentPageName,
        productPlanType,
        instanceId,
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
