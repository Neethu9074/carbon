/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import perBeaconTypeConfigs from 'in-mobile-apps/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs';
import BeaconsPresenter from 'in-mobile-apps/analyze/AnalyzeView/Beacons/BeaconsPresenter';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { timestampMetricName } from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import { sessionViewPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import SessionView from 'in-mobile-apps/analyze/SessionView/SessionView';
import cursorPaginated from 'in-hoc/cursorPaginated';

const defaultOrderBy = 'mobileBeacon.timestamp';

export default compose(
  cursorPaginated({
    getResettingProps: () => ['tagFilters', 'orderBy', 'orderDirection', 'timeConfig'],
    get: ({ tagFilters, timeConfig, cursor, orderBy, orderDirection, availableMetrics }) => {
      if (orderBy === timestampMetricName) {
        orderBy = defaultOrderBy;
      } else {
        const definition = find(availableMetrics, m => orderBy.indexOf(m.metric) === 0);
        if (definition) {
          orderBy = definition.tag || defaultOrderBy;
        } else {
          orderBy = defaultOrderBy;
        }
      }

      return getMobileAppBeacons({
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
      });
    }
  }),
  withProps(({ beaconType }) => perBeaconTypeConfigs[beaconType])
)(RawCalls);

function RawCalls(props) {
  return (
    <Switch>
      <Route path={sessionViewPathFullyQualified} render={() => <SessionView {...props} />} />
      <Route path="*" render={() => <BeaconsPresenter {...props} />} />
    </Switch>
  );
}
