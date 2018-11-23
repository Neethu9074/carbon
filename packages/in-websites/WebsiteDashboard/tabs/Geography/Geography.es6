import { Route, Switch } from 'react-router-dom';
import React from 'react';

import WorldMapDashboardContent from 'in-websites/WebsiteDashboard/tabs/Geography/WorldMapDashboardContent';
import getWebsiteCountryBreakdown from 'in-subscription/websiteMonitoring/getWebsiteCountryBreakdown';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import GlobeView from 'in-new-components/GlobeView';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Geography.mless';

export default function Geography({ tagFilters, timeConfig }) {
  return (
    <div className={locals.wrapper}>
      <FullHeightWrapper
        render={height => (
          <Switch>
            <Route
              path={`${websitePathFullyQualified}/geography/globe`}
              render={() => (
                <div>
                  <GlobeView
                    customHeight={height}
                    getData$={() =>
                      getWebsiteCountryBreakdown({
                        timeConfig,
                        tagFilters,
                        pagination: {
                          page: 1,
                          pageSize: 200
                        },
                        order: {
                          by: 'countryName',
                          direction: 'ASC'
                        }
                      })
                    }
                  />
                  <Link
                    className={locals.link}
                    href$={getModifiedUrlStream(params => (params.pathname = `${websitePathFullyQualified}/geography`))}
                  >
                    <SvgIcon className={locals.mapSwitchIconDark} type="lib_website" width={24} height={24} />
                  </Link>
                </div>
              )}
            />

            <Route
              path={`${websitePathFullyQualified}/geography`}
              render={() => (
                <div>
                  <WorldMapDashboardContent height={height} />
                  <Link
                    className={locals.link}
                    href$={getModifiedUrlStream(
                      params => (params.pathname = `${websitePathFullyQualified}/geography/globe`)
                    )}
                  >
                    <SvgIcon className={locals.mapSwitchIconLight} type="lib_website_inverted" width={24} height={24} />
                  </Link>
                </div>
              )}
            />
          </Switch>
        )}
      />
      <DisabledBodyScroll />
    </div>
  );
}
