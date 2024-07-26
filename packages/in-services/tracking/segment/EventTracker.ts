/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { find } from 'lodash';

import { combineLatest } from '@instana/observables';

import {
  commomMilestoneVersion,
  customRealmName,
  productCode,
  productCodeType,
  productTitle,
  ut30
} from 'in-services/util/constants';
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
}

interface currentUnitProps {
  tenantUnitId: string;
  tenantUnitName: string;
  tenantName: string;
}
interface UsageInfoProps {
  activeLicenseType: string;
}

let productPlanType: string;
let instanceId: string;
let tenantName: string;
let tenantUnitName: string;
let userId: string;
const segment = Segment();
const url = window.location.href;
const path = window.location.pathname;
export const eventTracker = ({ eventName, parentProductArea, parentPageName }: EventTrackerProps) => {
  if (!segment) return;
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
    segment.track(eventName, {
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
  return null; // SegmentEventTracker does not render anything
};
