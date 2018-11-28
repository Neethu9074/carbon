import { Route, Switch } from 'react-router-dom';
import React from 'react';

import WorldMapDashboardContent from 'in-websites/WebsiteDashboard/tabs/Geography/WorldMapDashboardContent';
import getWebsiteCountryBreakdown from 'in-subscription/websiteMonitoring/getWebsiteCountryBreakdown';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import HeatMapLegend from 'in-new-components/HeatMapLegend';
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
                  <GlobeView customHeight={height} getData$={() => getData$({ timeConfig, tagFilters })} />
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
                  <WorldMapDashboardContent
                    tagFilters={tagFilters}
                    timeConfig={timeConfig}
                    height={height}
                    getDataByCountry$={props => getData$(props)}
                  />
                  <Link
                    className={locals.link}
                    href$={getModifiedUrlStream(
                      params => (params.pathname = `${websitePathFullyQualified}/geography/globe`)
                    )}
                  >
                    <SvgIcon className={locals.mapSwitchIconLight} type="lib_website_inverted" width={24} height={24} />
                  </Link>
                  <Legend tagFilters={tagFilters} timeConfig={timeConfig} />
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

import connectTo from 'in-hoc/connectTo';

const Legend = connectTo(
  props => ({
    data: getData$(props).map(result => {
      if (!result.data) {
        return null;
      }
      let min = Number.MAX_VALUE;
      let max = 0;
      for (let i = 0; i < result.data.items.length; i++) {
        const item = result.data.items[i];
        min = Math.min(min, item.pageLoads);
        max = Math.max(max, item.pageLoads);
      }
      return { min, max };
    })
  }),
  function Legend({ data, light }) {
    if (!data) {
      return null;
    }
    return (
      <HeatMapLegend
        light={light}
        className={locals.heatMapLegend}
        valueFrom={`${data.min} calls`}
        valueTo={`${data.max} calls`}
        colorFrom="#ffcc00"
        colorTo="#990000"
      />
    );
  }
);

function getData$({ timeConfig, tagFilters }) {
  return getWebsiteCountryBreakdown({
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
  });
}
