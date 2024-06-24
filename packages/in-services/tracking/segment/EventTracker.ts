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

let productPlanType: string;
let userId: string;

const segment = Segment();

export const eventTracker = ({ data, segmentEventName }: EventTrackerProps) => {
  const url = window.location.href;
  const userSelfDefinedRole =
    window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
  productPlanType = getLicenseTypeForSegment(config.activeLicenseType);
  userId = customRealmName + '-' + config.tenantUnitId;
  const segmentProperties = {
    ...data,
    UT30: ut30,
    tenantId: config.tenantId,
    instanceId: config.tenantUnitId,
    instanceName: config.tenantUnit,
    tenantName: config.tenant,
    productCode: productCode,
    productCodeType: productCodeType,
    productPlanType: productPlanType,
    productTitle: productTitle,
    url: url,
    roles: [userSelfDefinedRole],
    'user.bluemixId': userId
  };
  segment.track(segmentEventName, segmentProperties);
};
