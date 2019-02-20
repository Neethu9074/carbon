import React, { Fragment } from 'react';

import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import getWebsiteBeacons from 'in-subscription/websiteMonitoring/getWebsiteBeacons';
import { navigateToPageLoadFromBackendTrace } from 'in-websites/tracker';
import { getLinkToPageLoad } from 'in-websites/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

import locals from './WebsiteMonitoringData.mless';

export default connect(({ traceId, startTime }) => {
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

  const beacon = result.data.items[0].beacon;

  return (
    <Fragment>
      <div className={locals.wrapper}>
        <span>
          <span className={locals.title}>Corresponding Website Activity</span>
          We detected a website page load that provided the user information and meta data below.
        </span>

        <Button
          onClick={() => navigateToPageLoadFromBackendTrace()}
          href$={getLinkToPageLoad({
            pageLoadId: beacon.pageLoadId,
            beaconTimestamp: beacon.timestamp
          })}
          kind="primaryv2"
          size="compact"
        >
          View Page Load
        </Button>
      </div>

      <BeaconUserSummary beacon={beacon} />
    </Fragment>
  );
});
