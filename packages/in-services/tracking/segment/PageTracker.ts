/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-ignore
import { useEffect } from 'react';

import { combineLatest } from '@instana/observables';

import { commomMilestoneVersion, productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
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

    combineLatest([getTenantsWithUnits(), getUsageInfo({})]).once(([tenantWithUnits, usageInfo]) => {
      const usageInfoWithType = usageInfo as unknown as UsageInfoProps;
      const tenantWithUnitsWithType = tenantWithUnits as unknown as TenantsWithUnits;
      productPlanType = getLicenseTypeForSegment(usageInfoWithType?.activeLicenseType);
      const units: any = tenantWithUnitsWithType[tenant?.name!];

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
        productTitle,
        ut30,
        productCodeType,
        productCode,
        commomMilestoneVersion
      });
    });
  }, [parentProductArea, parentPageName]);
  return null; // SegmentEventTracker does not render anything
};

export default PageTracker;
