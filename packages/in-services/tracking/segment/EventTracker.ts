/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { find } from 'lodash';

import { customRealmName, productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
import { UsageInfoProps, currentUnitProps, EventTrackerProps } from 'in-services/tracking/segment/types';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { TenantsWithUnits, getTenantsWithUnitsCached } from 'in-api/account';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

let productPlanType: string;
let tenantUnitId: string;
let tenantUnitName: string;
let userId: string;
let tenantId: string;
let tenantName: string;

const segment = Segment();

export const eventTracker = ({ data, segmentEventName }: EventTrackerProps) => {
  if (!segment) return;

  const url = window.location.href;
  const userSelfDefinedRole =
    window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
  getUsageInfo({}).once((usageInfo: unknown) => {
    const usageInfoWithType = usageInfo as UsageInfoProps;
    productPlanType = getLicenseTypeForSegment(usageInfoWithType?.activeLicenseType);
    getTenantsWithUnitsCached().once((tenantWithUnits: TenantsWithUnits) => {
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
      const segmentProperties = {
        ...data,
        UT30: ut30,
        tenantId: tenantId,
        instanceId: tenantUnitId,
        instanceName: tenantUnitName,
        tenantName: tenantName,
        productCode: productCode,
        productCodeType: productCodeType,
        productPlanType: productPlanType,
        productTitle: productTitle,
        url: url,
        roles: [userSelfDefinedRole],
        'user.bluemixId': userId
      };
      segment.track(segmentEventName, segmentProperties);
    });
  });
  return null; // SegmentEventTracker does not render anything
};
