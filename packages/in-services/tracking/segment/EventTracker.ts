/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { customRealmName, productCode, productCodeType, productTitle, ut30 } from 'in-services/util/constants';
//@ts-expect-error
import { Segment } from 'in-services/tracking/segment/SegmentInit';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { config } from 'in-services/config';
import { user } from 'in-stores/user';

let productPlanType: string;
let userId: string;

const segment = Segment();

export const eventTracker = ({ data, segmentEventName }: EventTrackerProps) => {
  try {
    if (!segment) {
      return;
    }

    const url = window.location.href;
    const { tenantUnitId, tenantId, tenantUnit, tenant, activeLicenseType } = config;
    if (!tenantUnitId) {
      return;
    }

    const userSelfDefinedRole =
      window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
    productPlanType = getLicenseTypeForSegment(activeLicenseType);
    // @ts-expect-error not types available...
    userId = `${customRealmName}-${user?.id}`;
    const segmentProperties = {
      ...data,
      UT30: ut30,
      tenantId: tenantId,
      instanceId: tenantUnitId,
      instanceName: tenantUnit,
      tenantName: tenant,
      productCode: productCode,
      productCodeType: productCodeType,
      productPlanType: productPlanType,
      productTitle: productTitle,
      url: url,
      altUserId: userId,
      roles: [userSelfDefinedRole],
      'user.bluemixId': userId
    };
    segment.track(segmentEventName, segmentProperties);
  } catch (e) {
    //ignore
  }
};
