import { Route, Switch } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import React from 'react';

import perBeaconTypeConfigs from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs';
import BeaconsPresenter from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsPresenter';
import getWebsiteBeacons from 'in-subscription/websiteMonitoring/getWebsiteBeacons';
import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import PageLoadView from 'in-websites/analyze/PageLoadView/PageLoadView';
import cursorPaginated from 'in-hoc/cursorPaginated';

export default compose(
  cursorPaginated({
    getResettingProps: () => ['tagFilters', 'orderBy', 'orderDirection', 'timeConfig'],
    get: ({ tagFilters, timeConfig, cursor, orderBy, orderDirection }) =>
      getWebsiteBeacons({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderBy,
          direction: orderDirection
        },
        timeConfig,
        tagFilters
      })
  }),
  withProps(({ beaconType }) => perBeaconTypeConfigs[beaconType])
)(RawCalls);

function RawCalls(props) {
  return (
    <Switch>
      <Route path={pageLoadViewPathFullyQualified} render={() => <PageLoadView {...props} />} />
      <Route path="*" render={() => <BeaconsPresenter {...props} />} />
    </Switch>
  );
}
