import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { snapshots$ } from 'in-views/eumView/stores/snapshots';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import './EumView.less';

const block = 'in-eum';
const headerElement = `${block}__header`;
const configureElement = `${headerElement}__configure`;

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
            <h2>Websites</h2>
            <LoadingIndicator type="dark" />
          </div>
        </FullscreenOverlayView>
      );
    }

    return (
      <FullscreenOverlayView>
        <div className={block}>
          <div className={headerElement}>
            <div>
              <h2>Websites ({snapshots.length})</h2>
            </div>
            <div className={configureElement}>
              <Link href={'#'} external className={configureElement}>
                Configure
              </Link>
            </div>
          </div>
          <WebsiteTable snapshots={snapshots} />
          <DashboardNavigationRoute />
        </div>
      </FullscreenOverlayView>
    );
  }
);
