/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import perBeaconTypeConfigs from 'in-websites/analyze/AnalyzeView/Beacons/perBeaconTypeConfigs';
import BeaconsPresenter from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsPresenter';
import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import { timestampMetricName } from 'in-websites/analyze/AnalyzeView/metrics';
import getWebsiteBeacons from 'in-websites/subscriptions/getWebsiteBeacons';
import PageLoadView from 'in-websites/analyze/PageLoadView/PageLoadView';
import cursorPaginated from 'in-hoc/cursorPaginated';

const defaultOrderBy = 'beacon.timestamp';

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

      return getWebsiteBeacons({
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
      <Route path={pageLoadViewPathFullyQualified} render={() => <PageLoadView {...props} />} />
      <Route path="*" render={() => <BeaconsPresenter {...props} />} />
    </Switch>
  );
}
