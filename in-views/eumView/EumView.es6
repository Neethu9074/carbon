import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { data$ } from 'in-views/eumView/stores/snapshots';
import { getLinkToPath } from 'in-stores/navigation';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';

import './EumView.less';

const block = 'in-eum';
const headerElement = `${block}__header`;
const configureElement = `${headerElement}__configure`;

export default connectTo(
  {
    data: data$
  },
  function EumView({ data }) {
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
        </div>
      );
    }

    if (isBlank(query) && snapshotIds.size === 0 && snapshots.length === 0 && role.canConfigureEumApplications) {
      // data was loaded but there is no defined website
      return <RedirectWithHash to="/website/new" />;
    }

    return (
      <Switch>
        {DashboardNavigationRoute}

        <Route
          path="/website"
          render={() => (
            <FullscreenOverlayView className={`${block}__fullscreen-overview`}>
              <Title title="Websites" />
              <div className={block}>
                <div className={headerElement}>
                  <div>
                    <WebsiteHeading numWebsites={snapshots.length} />
                  </div>
                  <div className={configureElement}>
                    {role.canConfigureEumApplications ? (
                      <Link href$={getLinkToPath('/website/new')} className={configureElement}>
                        Add Website
                      </Link>
                    ) : null}
                  </div>
                </div>
                <WebsiteTable snapshots={snapshots} />
              </div>
            </FullscreenOverlayView>
          )}
        />
      </Switch>
    );
  }
);
