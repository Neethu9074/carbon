import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import GroupedBeaconsTable from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import getWebsiteBeaconGroups from 'in-subscription/websiteMonitoring/getWebsiteBeaconGroups';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { getChartGranularity } from 'in-applications/metrics';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Button from 'in-new-components/Button';
import theme from 'in-themes';

import locals from './GroupedBeacons.mless';

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
  const { items, totalHits, isChartSectionExpanded, setIsChartSectionExpanded, onEditGroupDialog } = props;

  const groupColors = items.map(
    (group, groupIndex) =>
      theme.lib.colors.chart.strokeColors100[groupIndex % theme.lib.colors.chart.strokeColors100.length]
  );

  return (
    <Fragment>
      <QuickFilterBar {...props} />
      <MaxWidthFullscreenContainer>
        <div onClick={() => onEditGroupDialog()}>Edit Groups</div>
        <TagFilterList {...props} />
        <div className={locals.wrapper}>
          <ResultHeader itemType="Beacon" nbRows={totalHits} />
          <Button
            kind="secondary"
            onClick={() => setIsChartSectionExpanded(!isChartSectionExpanded)}
            icon="lib_views_stats"
          >
            {isChartSectionExpanded ? 'Hide' : 'Show'} Graph
          </Button>
        </div>
        <GroupedBeaconsTable {...props} groupColors={groupColors} />
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}
