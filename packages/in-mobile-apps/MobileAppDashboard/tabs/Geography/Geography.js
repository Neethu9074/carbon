import { Route, Switch } from 'react-router-dom';
import React from 'react';

import GlobeViewLoader from 'promise-loader?global,globe-view!in-websites/WebsiteDashboard/components/GlobeView';
import getMobileAppCountryBreakdown from 'in-mobile-apps/subscriptions/getMobileAppCountryBreakdown';
import TwoDMobileAppGeoMap from 'in-mobile-apps/MobileAppDashboard/tabs/Geography/2DMobileAppGeoMap';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import Button from 'in-new-components/MapControls/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './Geography.mless';

const GlobeView = createAsyncViewComponent(GlobeViewLoader);

export default function Geography(props) {
  const { tagFilters, timeConfig } = props;
  useDisabledBodyScroll();

  return (
    <WithEmptyStateFallback
      getHasDataToRender={() => getHasDataToRender(props)}
      title="No sessions available"
      explanation={`There were no sessions found in the selected time range${
        tagFilters && tagFilters.length > 1 ? ` matching your filters` : ''
      }.`}
    >
      <div className={locals.wrapper}>
        <FullHeightWrapper
          render={height => (
            <Switch>
              <Route
                path={`${mobileAppPathFullyQualified}/geography/globe`}
                render={() => (
                  <div>
                    <GlobeView
                      customHeight={height}
                      tagFilters={tagFilters}
                      timeConfig={timeConfig}
                      getData$={getData$}
                      getValue={v => v.sessions}
                    />
                    <Link
                      className={locals.link}
                      href$={getModifiedUrlStream(
                        params => (params.pathname = `${mobileAppPathFullyQualified}/geography`)
                      )}
                    >
                      <SvgIcon className={locals.mapSwitchIconDark} type="lib_website" />
                    </Link>
                  </div>
                )}
              />

              <Route
                path={`${mobileAppPathFullyQualified}/geography`}
                render={() => (
                  <div>
                    <TwoDMobileAppGeoMap
                      tagFilters={tagFilters}
                      timeConfig={timeConfig}
                      height={height}
                      controlWrapperClassName={locals.controlWrapperClassName}
                    />
                    <Tooltip content="Switch to 3D globe" align="leftMiddle">
                      <Button
                        href$={getModifiedUrlStream(
                          params => (params.pathname = `${mobileAppPathFullyQualified}/geography/globe`)
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
      </div>
    </WithEmptyStateFallback>
  );
}

function getData$({ timeConfig, tagFilters }) {
  const tagFiltersInclSessionStartFilter = tagFilters.concat({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'sessionStart'
  });

  return getMobileAppCountryBreakdown({
    timeConfig,
    tagFilters: tagFiltersInclSessionStartFilter,
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

function getHasDataToRender(props) {
  return getData$(props).map(result => !result.data || result.data.totalHits > 0);
}
