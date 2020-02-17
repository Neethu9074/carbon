import { compose, withState, withProps } from 'recompose';
import React, { Fragment } from 'react';

import {
  showMobileAppDetailsInTraceView,
  hideMobileAppDetailsInTraceView,
  navigateToSessionFromBackendTrace
} from 'in-mobile-apps/tracker';
import BeaconUserSummary from 'in-mobile-apps/analyze/BeaconUserSummary/BeaconUserSummary';
import { getLinkToMobileApp, getLinkToSession } from 'in-mobile-apps/navigation/paths';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { get, trySet } from 'in-services/localStorage';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './MobileAppMonitoringData.mless';

const localStorageKey = 'traceView.showMobileAppMonitoringData';

export default compose(
  connect(({ correlationId, startTime }) => {
    return {
      result: getMobileAppBeacons({
        tagFilters: [{ name: 'mobileBeacon.backend.traceId', stringValue: correlationId, operator: 'EQUALS' }],
        timeConfig: {
          windowSize: 1000 * 60 * 60,
          to: startTime + 1000 * 60 * 30,
          focusedMoment: startTime + 1000 * 60 * 30
        },
        order: {
          by: 'mobileBeacon.timestamp',
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
        showMobileAppDetailsInTraceView();
      } else {
        hideMobileAppDetailsInTraceView();
      }
      setShowDetails(show);
    }
  }))
)(function MobileAppMonitoringData({ result, showDetails, setShowDetails }) {
  if (!result || result.data == null || result.data.items.length === 0) {
    return null;
  }

  const beacon = result.data.items[0].beacon;

  return (
    <Fragment>
      <div className={locals.wrapper}>
        <span className={locals.leftSide}>
          <SvgIcon type="lib_mobile_app" className={locals.icon} />
          <span className={locals.title}>Corresponding Mobile App Activity</span>
          This trace is caused by activity on the&nbsp;
          <Link href$={getLinkToMobileApp(beacon.mobileAppId)}>{beacon.mobileAppLabel}</Link>
          &nbsp;mobile app.
        </span>

        <span>
          <Button onClick={() => setShowDetails(!showDetails)} kind="secondary" size="compact">
            {showDetails ? 'Hide ' : 'Show '} Mobile App Information
          </Button>
          <Button
            onClick={() => navigateToSessionFromBackendTrace()}
            href$={getLinkToSession({
              sessionId: beacon.sessionId,
              beaconTimestamp: beacon.timestamp
            })}
            kind="primary"
            size="compact"
          >
            View Mobile App Activity
          </Button>
        </span>
      </div>

      {showDetails && <BeaconUserSummary beacon={beacon} />}
    </Fragment>
  );
});
