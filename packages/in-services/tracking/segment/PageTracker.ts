/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

//@ts-expect-error
import { Segment, commonProperties } from 'in-services/tracking/segment/SegmentInit';
import { playwithEnabled } from 'in-services/featureFlags';
import { config } from 'in-services/config';

interface SegmentEventTrackerProps {
  parentProductArea: string;
  parentPageName: string;
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
    const productPlanType = 'NFR';
    const instanceId = config.tenantUnit;
    segment.page('', parentPageName, {
      url,
      path,
      parentProductArea,
      parentPageName,
      productPlanType,
      instanceId,
      commonProperties
    });
  }, [parentProductArea, parentPageName]);
  return null; // SegmentEventTracker does not render anything
};

export default PageTracker;
