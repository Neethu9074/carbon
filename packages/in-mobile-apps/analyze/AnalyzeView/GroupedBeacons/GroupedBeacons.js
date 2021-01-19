/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import theme from 'in-themes';
import React from 'react';

import {
  timestampMetricName,
  groupNameMetricName,
  groupCountMetricName
} from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import GroupedBeaconsTable from 'in-mobile-apps/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import MobileAppGroupMetricsChart from 'in-mobile-apps/analyze/AnalyzeView/MobileAppGroupMetricsChart';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { getChartGranularity } from 'in-applications/metrics';
import SetBodyColor from 'in-components/SetBodyColor';
import cursorPaginated from 'in-hoc/cursorPaginated';
import withUrlState from 'in-hoc/withUrlState';
import Sticky from 'in-components/Sticky';

const defaultCountMetric = {
  metric: 'beaconCount',
  aggregation: 'SUM'
};

export default compose(
  withUrlState({
    bind: [
      {
        path: '/analyzeBeacons',
        name: 'showGraph',
        parser: v => v === 'true',
        serializer: String,
        initialState: false
      },
      {
        path: '/analyzeBeacons',
        name: 'focusedMetric'
      }
    ],
    reducerName: 'onChange',
    replaceHistory: true
  }),
  cursorPaginated({
    getResettingProps: () => ['timeConfig', 'orderBy', 'orderDirection', 'showGraph', 'tagFilters', 'group', 'metrics'],
    get: ({ tagFilters, cursor, timeConfig, orderBy, orderDirection, showGraph, group, metrics }) => {
      metrics = metrics.concat(defaultCountMetric);
      const granularity = getChartGranularity(timeConfig);

      const metricsForQuery = metrics.reduce((agg, { metric, aggregation }) => {
        agg[`${metric}_${aggregation}_Agg`] = {
          metric,
          aggregation
        };

        if (showGraph) {
          agg[`${metric}_${aggregation}`] = {
            metric,
            aggregation,
            granularity
          };
        }

        return agg;
      }, {});

      if (orderBy === timestampMetricName) {
        orderBy = 'earliestTimestamp';
      } else if (orderBy === groupNameMetricName) {
        orderBy = 'name';
      } else if (orderBy === groupCountMetricName) {
        orderBy = 'beaconCount_SUM_Agg';
      }

      return getMobileAppBeaconGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderBy,
          direction: orderDirection
        },
        timeConfig,
        metrics: metricsForQuery,
        tagFilters,
        group
      });
    }
  })
)(GroupedBeacons);

function GroupedBeacons(props) {
  const { items, showGraph } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <>
      <Sticky
        header={
          <>
            <AnalyzeHeader
              isGrouped
              renderQuickFilterBar={() => (
                <QuickFilterBar
                  showMobileAppSelector
                  showViewSelector
                  showSubdivisionSelector
                  showWindowWidthSelector
                  {...props}
                />
              )}
            />
          </>
        }
      >
        <LeftRightPadding>
          <TagFilterList {...props} />
          <GroupingTableHeader itemType="Group" {...props} />
          {showGraph && <MobileAppGroupMetricsChart {...props} groupColors={groupColors} />}
          <GroupedBeaconsTable {...props} groupColors={groupColors} />
        </LeftRightPadding>
        <SetBodyColor color="#fff" />
      </Sticky>
    </>
  );
}
