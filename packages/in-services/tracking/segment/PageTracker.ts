/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { UsageInfoProps, currentUnitProps, PageTrackerProps } from 'in-services/tracking/segment/types';
import { productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { customRealmName } from 'in-services/util/constants';
import { getTenantsWithUnitsCached } from 'in-api/account';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { TenantsWithUnits } from 'in-api/account';
import { find } from 'in-services/arrayUtils';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

let productPlanType: string;
let tenantUnitId: string;
let tenantUnitName: string;
let userId: string;
let tenantId: string;
let tenantName: string;

const segment = Segment();
const usePageTracker = ({ productArea, pageRootName }: PageTrackerProps) => {
  const location = useLocation();
  const usageInfo = useObservable(() => getUsageInfo({}), []);
  useEffect(() => {
    if (!(productArea && pageRootName)) {
      return;
    }
    if (!usageInfo) {
      return;
    }
    if (!segment) {
      return;
    }
    const url = window.location.href;
    const path = location.pathname;
    const userSelfDefinedRole =
      window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
    getTenantsWithUnitsCached().once((tenantWithUnits: TenantsWithUnits) => {
      const usageInfoWithType = usageInfo as unknown as UsageInfoProps;
      productPlanType = getLicenseTypeForSegment(usageInfoWithType?.activeLicenseType);
      const units: any = tenantWithUnits[tenant?.name!];

      if (!units) {
        return;
      }
      const currentUnit: currentUnitProps = find(units, unit => unit.tenantUnitName === config.tenantUnit)!;
      if (currentUnit) {
        tenantName = currentUnit.tenantName;
        tenantId = currentUnit.tenantId;
        tenantUnitId = currentUnit.tenantUnitId;
        tenantUnitName = currentUnit.tenantUnitName;
      }
      userId = customRealmName + '-' + tenantUnitId;

      segment.page('Page Viewed', {
        UT30: ut30,
        instanceId: tenantUnitId,
        instanceName: tenantUnitName,
        tenantId: tenantId,
        tenantName: tenantName,
        parentPageCategory: productArea,
        parentPageName: pageRootName,
        path: path,
        productCode: productCode,
        productCodeType: productCodeType,
        productPlanType: productPlanType,
        productTitle: productTitle,
        url: url,
        roles: [userSelfDefinedRole],
        'user.bluemixId': userId
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productArea, pageRootName, Boolean(usageInfo) /*exists?*/, location.pathname]);
  return null; // SegmentEventTracker does not render anything
};

/* TODO rename the file to make it clear that it is a custom react hook */
export default usePageTracker;
