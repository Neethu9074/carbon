/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { find } from 'lodash';

import { combineLatest } from '@instana/observables';

import { customRealmName, productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
import { PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED } from 'in-services/tracking/eventNames';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { TenantsWithUnits, getTenantsWithUnits } from 'in-api/account';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { config } from 'in-services/config';
import { tenant } from 'in-stores/user';

interface EventTrackerProps {
  parentProductArea: string;
  parentPageName: string;
  eventName: string;
  pathName: string;
}

interface currentUnitProps {
  tenantId: string;
  tenantUnitId: string;
  tenantUnitName: string;
  tenantName: string;
}
interface UsageInfoProps {
  activeLicenseType: string;
}

let productPlanType: string;
let instanceId: string;
let tenantUnitName: string;
let userId: string;
let tenantId: string;
let tenantName: string;

const segment = Segment();

export const eventTracker = ({ eventName, parentProductArea, parentPageName, pathName }: EventTrackerProps) => {
  const url = window.location.href;
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
      tenantName = currentUnit.tenantName;
      tenantId = currentUnit.tenantId;
      instanceId = currentUnit.tenantUnitId;
      tenantUnitName = currentUnit.tenantUnitName;
    }
    userId = customRealmName + '-' + instanceId;

    segment.track(eventName, {
      CTA: PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED,
      UT30: ut30,
      instanceId: instanceId,
      instanceName: tenantUnitName,
      tenantId: tenantId,
      tenantName: tenantName,
      parentPageCategory: parentProductArea,
      parentPageName: parentPageName,
      path: pathName,
      productCode: productCode,
      productCodeType: productCodeType,
      productPlanType: productPlanType,
      productTitle: productTitle,
      url: url,
      'user.bluemixId': userId,
      'user.role': userSelfDefinedRole
    });
  });
  return null; // SegmentEventTracker does not render anything
};
