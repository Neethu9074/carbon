import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import { newWebsitePath } from 'in-stores/navigation/paths/mainPaths';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { search } from 'in-stores/snapshot/snapshot';
import LegacyView from 'in-components/LegacyView';
import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';

import './EumView.less';

const block = 'in-eum';
const headerElement = `${block}__header`;
const configureElement = `${headerElement}__configure`;

const loadingState = (
  <div className={`${block}__wrapper`}>
    <LegacyView />
    <div className={block}>
      <WebsiteHeading />
      <LoadingIndicator type="dark" />
    </div>
  </div>
);

export default connectTo(
  {
    data: search({ customQuery: 'entity.selfType:website' })
  },
  function EumView({ data }) {
    if (!data) {
      return loadingState;
    }
    const { snapshotIds, snapshots } = data;

    if (!snapshotIds || !snapshots) {
      return loadingState;
    }

    if (snapshotIds.size === 0 && snapshots.length === 0 && role.canConfigureEumApplications) {
      // data was loaded but there is no defined website
      return <RedirectWithHash to={newWebsitePath} />;
    }

    return (
      <Switch>
        {DashboardNavigationRoute}

        <Route
          path="/website"
          render={() => (
            <div className={`${block}__fullscreen-overview`}>
              <Title title="Websites" />
              <LegacyView />

              <div className={block}>
                <div className={headerElement}>
                  <div>
                    <WebsiteHeading numWebsites={snapshots.length} />
                  </div>
                  <div className={configureElement}>
                    {role.canConfigureEumApplications ? (
                      <Link href$={getView(newWebsitePath)} className={configureElement}>
                        Add Website
                      </Link>
                    ) : null}
                  </div>
                </div>
                <WebsiteTable snapshots={snapshots} />
              </div>
            </div>
          )}
        />
      </Switch>
    );
  }
);
