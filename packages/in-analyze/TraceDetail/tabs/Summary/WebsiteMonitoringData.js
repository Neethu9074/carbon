import { compose, withState, withProps } from 'recompose';
import React, { Fragment } from 'react';

import {
  showWebsiteDetailsInTraceView,
  hideWebsiteDetailsInTraceView,
  navigateToPageLoadFromBackendTrace
} from 'in-websites/tracker';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import getWebsiteBeacons from 'in-websites/subscriptions/getWebsiteBeacons';
import { getLinkToWebsite, getLinkToPageLoad } from 'in-websites/navigation/paths';
import { get, trySet } from 'in-services/localStorage';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './WebsiteMonitoringData.mless';

const localStorageKey = 'traceView.showWebsiteMonitoringData';

export default compose(
  connect(({ traceId, startTime }) => {
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
  }),
  withState('showDetails', 'setShowDetails', get(localStorageKey) !== 'false'),
  withProps(({ setShowDetails }) => ({
    setShowDetails: show => {
      trySet(localStorageKey, show);
      if (show) {
        showWebsiteDetailsInTraceView();
      } else {
        hideWebsiteDetailsInTraceView();
      }
      setShowDetails(show);
    }
  }))
)(function WebsiteMonitoringData({ result, showDetails, setShowDetails }) {
  if (!result || result.data == null || result.data.items.length === 0) {
    return null;
  }

  const beacon = result.data.items[0].beacon;

  return (
    <Fragment>
      <div className={locals.wrapper}>
        <span className={locals.leftSide}>
          <SvgIcon type="lib_website" className={locals.icon} />
          <span className={locals.title}>Corresponding Website Activity</span>
          This trace is caused by activity on the&nbsp;
          <Link href$={getLinkToWebsite(beacon.websiteId)}>{beacon.websiteLabel}</Link>
          &nbsp;website.
        </span>

        <span>
          <Button onClick={() => setShowDetails(!showDetails)} kind="secondary" size="compact">
            {showDetails ? 'Hide ' : 'Show '} Website Information
          </Button>
          <Button
            onClick={() => navigateToPageLoadFromBackendTrace()}
            href$={getLinkToPageLoad({
              pageLoadId: beacon.pageLoadId,
              beaconTimestamp: beacon.timestamp
            })}
            kind="primary"
            size="compact"
          >
            View Website Activity
          </Button>
        </span>
      </div>

      {showDetails && <BeaconUserSummary beacon={beacon} />}
    </Fragment>
  );
});
