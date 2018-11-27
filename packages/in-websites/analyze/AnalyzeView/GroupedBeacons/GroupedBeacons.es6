import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import GroupedBeaconsTable from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import getWebsiteBeaconGroups from 'in-subscription/websiteMonitoring/getWebsiteBeaconGroups';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Title from 'in-components/Title';
import theme from 'in-themes';

const tableMetrics = {
  beaconCountAgg: {
    metric: 'beaconCount',
    aggregation: 'SUM'
  },
  beaconDurationAgg: {
    metric: 'beaconDuration',
    aggregation: 'MEAN'
  }
};

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'groups.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: 'beaconCountAgg',
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  withState('isChartSectionExpanded', 'setIsChartSectionExpanded', false),
  cursorPaginated({
    getResettingProps: () => [
      'timeConfig',
      'orderBy',
      'orderDirection',
      'isChartSectionExpanded',
      'tagFilters',
      'group'
    ],
    get: ({ tagFilters, cursor, timeConfig, orderBy, orderDirection, isChartSectionExpanded, group }) => {
      let metrics = tableMetrics;
      if (isChartSectionExpanded) {
        metrics = {
          ...tableMetrics,
          beaconCount: {
            metric: 'beaconCount',
            aggregation: 'SUM',
            granularity: getChartGranularity(timeConfig)
          },
          beaconDuration: {
            metric: 'beaconDuration',
            aggregation: 'MEAN',
            granularity: getChartGranularity(timeConfig)
          }
        };
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
        metrics,
        tagFilters,
        group
      });
    }
  })
)(GroupedBeacons);

function GroupedBeacons(props) {
  const { items } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Fragment>
      <Title title="Analyze Beacon Groups" />
      <QuickFilterBar {...props} />
      <MaxWidthFullscreenContainer>
        <TagFilterList {...props} />
        <GroupingInfo {...props} />
        <GroupingTableHeader {...props} />
        <GroupedBeaconsTable {...props} groupColors={groupColors} />
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}
