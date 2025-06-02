/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { productCode, productCodeType, productPlatformTitle, productTitle, ut30 } from 'in-services/util/constants';
import { getLicenseTypeForSegment } from 'in-services/util/segmentLicenseType';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { PageTrackerProps } from 'in-services/tracking/segment/types';
import { customRealmName } from 'in-services/util/constants';
import { playwithEnabled } from 'in-services/featureFlags';
import { config } from 'in-services/config';
import { user } from 'in-stores/user';

let productPlanType: string;
let userId: string;
let hasIdentified = false;

const usePageTracker = ({ productArea, pageRootName }: PageTrackerProps) => {
  const location = useLocation();
  useEffect(() => {
    if (!(productArea && pageRootName)) {
      return;
    }
    if (!window.analytics) {
      return;
    }

    const url = window.location.href;
    const { tenantUnitId, tenantId, tenantUnit, tenant, activeLicenseType } = config;
    if (!tenantUnitId) {
      return;
    }

    const path = location.pathname;
    const userSelfDefinedRole =
      window.instana?.termsAndPrivacySettings?.dynamicRole || window.instana?.termsAndPrivacySettings?.role;
    productPlanType = getLicenseTypeForSegment(activeLicenseType);
    // @ts-expect-error not types available...
    userId = customRealmName + '-' + user?.id;
    // Call identify only once
    if (!hasIdentified && userId && !playwithEnabled) {
      window.analytics.identify(userId);
      hasIdentified = true;
    }
    window.analytics.page('Page Viewed', {
      UT30: ut30,
      instanceId: tenantUnitId,
      instanceName: tenantUnit,
      tenantId: tenantId,
      tenantName: tenant,
      parentPageCategory: productArea,
      parentPageName: pageRootName,
      path: path,
      productCode: productCode,
      productCodeType: productCodeType,
      productPlanType: productPlanType,
      productTitle: productTitle,
      url: url,
      altUserId: userId,
      platformTitle: productPlatformTitle,
      roles: [userSelfDefinedRole],
      'user.bluemixId': userId
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productArea, pageRootName, location.pathname]);
  return null; // SegmentEventTracker does not render anything
};

/* TODO rename the file to make it clear that it is a custom react hook */
export default usePageTracker;
