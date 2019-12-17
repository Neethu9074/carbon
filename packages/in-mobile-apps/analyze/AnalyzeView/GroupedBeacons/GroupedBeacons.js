import { compose, withState } from 'recompose';
import React from 'react';

import {
  timestampMetricName,
  groupNameMetricName,
  groupCountMetricName
} from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import GroupedBeaconsTable from 'in-mobile-apps/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import MobileAppGroupMetricsChart from 'in-mobile-apps/analyze/AnalyzeView/MobileAppGroupMetricsChart';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { getChartGranularity } from 'in-applications/metrics';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import theme from 'in-themes';

const defaultCountMetric = {
  metric: 'beaconCount',
  aggregation: 'SUM'
};

export default compose(
  withState('isChartSectionExpanded', 'setIsChartSectionExpanded', false),
  cursorPaginated({
    getResettingProps: () => [
      'timeConfig',
      'orderBy',
      'orderDirection',
      'isChartSectionExpanded',
      'tagFilters',
      'group',
      'metrics'
    ],
    get: ({ tagFilters, cursor, timeConfig, orderBy, orderDirection, isChartSectionExpanded, group, metrics }) => {
      metrics = metrics.concat(defaultCountMetric);
      const granularity = getChartGranularity(timeConfig);

      const metricsForQuery = metrics.reduce((agg, { metric, aggregation }) => {
        agg[`${metric}_${aggregation}_Agg`] = {
          metric,
          aggregation
        };

        if (isChartSectionExpanded) {
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
  const { items, isChartSectionExpanded, beaconType } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <>
      <Title title={`Analyze ${dataSourceTitles[beaconType]} Groups`} />
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
          {isChartSectionExpanded && <MobileAppGroupMetricsChart {...props} groupColors={groupColors} />}
          <GroupedBeaconsTable {...props} groupColors={groupColors} />
        </LeftRightPadding>
      </Sticky>
    </>
  );
}
