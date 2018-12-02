import { Route, Switch } from 'react-router-dom';
import React from 'react';

import getWebsiteCountryBreakdown from 'in-subscription/websiteMonitoring/getWebsiteCountryBreakdown';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import TwoDWebsiteGeoMap from 'in-websites/WebsiteDashboard/tabs/Geography/2DWebsiteGeoMap';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import Button from 'in-new-components/MapControls/Button';
import GlobeView from 'in-new-components/GlobeView';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
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
                    tagFilters={tagFilters}
                    timeConfig={timeConfig}
                    getData$={props => getData$(props)}
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
                  <TwoDWebsiteGeoMap
                    tagFilters={tagFilters}
                    timeConfig={timeConfig}
                    height={height}
                    controlWrapperClassName={locals.controlWrapperClassName}
                  />
                  <Tooltip content="Switch to 3D globe" align="leftMiddle">
                    <Button
                      href$={getModifiedUrlStream(
                        params => (params.pathname = `${websitePathFullyQualified}/geography/globe`)
                      )}
                      className={locals.to3D}
                      renderContent={() => <span>3D</span>}
                    />
                  </Tooltip>
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

function getData$({ timeConfig, tagFilters }) {
  const tagFiltersInclPageLoadFilter = tagFilters.concat({
    name: 'beacon.type',
    operator: 'EQUALS',
    stringValue: 'pageLoad'
  });

  return getWebsiteCountryBreakdown({
    timeConfig,
    tagFilters: tagFiltersInclPageLoadFilter,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'countryName',
      direction: 'ASC'
    }
  });
}
