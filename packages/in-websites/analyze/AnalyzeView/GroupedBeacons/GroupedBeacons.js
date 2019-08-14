import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import {
  timestampMetricName,
  groupNameMetricName,
  groupCountMetricName
} from 'in-websites/analyze/AnalyzeView/metrics';
import GroupedBeaconsTable from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import WebsiteGroupMetricsChart from 'in-websites/analyze/AnalyzeView/WebsiteGroupMetricsChart';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { getChartGranularity } from 'in-applications/metrics';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { dataSourceTitles } from 'in-websites/tags';
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

      return getWebsiteBeaconGroups({
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
    <Fragment>
      <Title title={`Analyze ${dataSourceTitles[beaconType]} Groups`} />
      <Sticky
        header={
          <Fragment>
            <AnalyzeHeader isGrouped />
            <QuickFilterBar showWebsiteSelector showPageSelector {...props} />
          </Fragment>
        }
      >
        <MaxWidthFullscreenContainer>
          <TagFilterList {...props} />
          <GroupingInfo {...props} />
          <GroupingTableHeader itemType="Group" {...props} />
          {isChartSectionExpanded && <WebsiteGroupMetricsChart {...props} groupColors={groupColors} />}
          <GroupedBeaconsTable {...props} groupColors={groupColors} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
