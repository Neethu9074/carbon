/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { combineLatest } from '@instana/observables';

import { productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { customRealmName } from 'in-services/util/constants';
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
let tenantUnitName: string;
let userId: string;
interface UsageInfoProps {
  activeLicenseType: string;
}
const segment = Segment();
const PageTracker = ({ parentProductArea, parentPageName }: SegmentEventTrackerProps) => {
  useEffect(() => {
    if (!segment) {
      return;
    }

    const url = window.location.href;
    const path = window.location.pathname;
    const userSelfDefinedRole =
      window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;

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
      }
      userId = customRealmName + '-' + instanceId;
      segment.page('Page Viewed', {
        UT30: ut30,
        instanceId: instanceId,
        instanceName: tenantUnitName,
        parentPageCategory: parentProductArea,
        parentPageName: parentPageName,
        path: path,
        productCode: productCode,
        productCodeType: productCodeType,
        productPlanType: productPlanType,
        productTitle: productTitle,
        tenantId: instanceId,
        url: url,
        user: {
          bluemixId: userId,
          role: userSelfDefinedRole,
          tenantId: instanceId
        }
      });
    });
  }, [parentProductArea, parentPageName]);
  return null; // SegmentEventTracker does not render anything
};

export default PageTracker;
