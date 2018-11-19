import React from 'react';

import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import getWebsiteBeacons from 'in-subscription/websiteMonitoring/getWebsiteBeacons';
import { twoZeroWebsiteMonitoringEnabled } from 'in-services/featureFlags';
import { emptyObject } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default connect(({ traceId, startTime }) => {
  if (!twoZeroWebsiteMonitoringEnabled) {
    return emptyObject;
  }

  return {
    result: getWebsiteBeacons({
      tagFilters: [{ name: 'beacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
      timeConfig: {
        windowSize: 1000 * 60 * 60,
        to: startTime + 1000 * 60 * 30,
        focusedMoment: startTime + 1000 * 60 * 30
      },
      order: {
        by: 'beacon.timestamp',
        direction: 'DESC'
      },
      pagination: {
        retrievalSize: 1
      }
    })
  };
})(function WebsiteMonitoringData({ result }) {
  if (!result || result.data == null || result.data.items.length === 0) {
    return null;
  }

  return <BeaconUserSummary beacon={result.data.items[0].beacon} />;
});
