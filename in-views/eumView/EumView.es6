import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { eumKeysViewLink$ } from 'in-stores/navigation/configuration';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { data$ } from 'in-views/eumView/stores/snapshots';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './EumView.less';

const block = 'in-eum';
const headerElement = `${block}__header`;
const configureElement = `${headerElement}__configure`;

export default connectTo(
  {
    eumKeysViewLink: eumKeysViewLink$,
    data: data$
  },
  function EumView({ eumKeysViewLink, data }) {
    const { snapshotIds, snapshots, query } = data;

    if (!snapshotIds || !snapshots) {
      return (
        <div>
          <FullscreenOverlayView className={`${block}__fullscreen-overview`}>
            <div className={block}>
              <WebsiteHeading />
              <LoadingIndicator type="dark" />
            </div>
          </FullscreenOverlayView>
          <DashboardNavigationRoute />
        </div>
      );
    }

    if (isBlank(query) && snapshotIds.size === 0 && snapshots.length === 0) {
      // data was loaded but there is no defined website
      return <RedirectWithHash to="/website/new" />;
    }

    return (
      <div>
        <FullscreenOverlayView className={`${block}__fullscreen-overview`}>
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
