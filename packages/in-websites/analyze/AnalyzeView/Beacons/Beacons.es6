import { Route, Switch } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import React from 'react';

import perBeaconTypeConfigs from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs';
import BeaconsPresenter from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsPresenter';
import getWebsiteBeacons from 'in-subscription/websiteMonitoring/getWebsiteBeacons';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { analyzePath } from 'in-websites/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyzePath,
    getMatrixPrefix: () => 'beacons.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: 'beacon.timestamp',
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
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
      <Route path="*" render={() => <BeaconsPresenter {...props} />} />
    </Switch>
  );
}
