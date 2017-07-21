import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import NoWebsiteLandingScreen from 'in-views/eumView/components/NoWebsiteLandingScreen';
import { snapshotIds$, snapshots$ } from 'in-views/eumView/stores/snapshots';
import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import { eumKeysViewLink$ } from 'in-stores/navigation/configuration';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import './EumView.less';

const block = 'in-eum';
const headerElement = `${block}__header`;
const configureElement = `${headerElement}__configure`;

export default connectTo(
  {
    eumKeysViewLink: eumKeysViewLink$,
    snapshotIds: snapshotIds$,
    snapshots: snapshots$
  },
  function EumView({ snapshotIds, snapshots, eumKeysViewLink }) {
    if (!snapshotIds || !snapshots) {
      return (
        <FullscreenOverlayView>
          <div className={block}>
            <WebsiteHeading />
            <LoadingIndicator type="dark" />
          </div>
        </FullscreenOverlayView>
      );
    }

    // data was loaded but there is no defined website
    if (snapshotIds.length === 0 && snapshots.length === 0) {
      return (
        <FullscreenOverlayView>
          <NoWebsiteLandingScreen />
        </FullscreenOverlayView>
      );
    }

    return (
      <div>
        <FullscreenOverlayView>
          <div className={block}>
            <div className={headerElement}>
              <div>
                <WebsiteHeading numWebsites={snapshots.length} />
              </div>
              <div className={configureElement}>
                <Link href={eumKeysViewLink} className={configureElement}>
                  Configure
                </Link>
              </div>
            </div>
            <WebsiteTable snapshots={snapshots} />
          </div>
        </FullscreenOverlayView>
        <DashboardNavigationRoute />
      </div>
    );
  }
);
