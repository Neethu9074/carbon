import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { snapshots$ } from 'in-views/eumView/stores/snapshots';
import connectTo from 'in-hoc/connectTo';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import './EumView.less';

const block = 'in-eum';

export default connectTo(
  () => {
    return {
      snapshots: snapshots$
    };
  },
  function EumView({ snapshots }) {
    if (!snapshots) {
      return (
        <FullscreenOverlayView>
          <div className={block}>
            <h4>Websites</h4>
            <LoadingIndicator type="dark" />
          </div>
        </FullscreenOverlayView>
      );
    }

    return (
      <FullscreenOverlayView>
        <div className={block}>
          <h4>Websites ({snapshots.length})</h4>
          <WebsiteTable snapshots={snapshots} />
          <DashboardNavigationRoute />
        </div>
      </FullscreenOverlayView>
    );
  }
);
