import { compose, withState, withProps } from 'recompose';
import React, { Fragment } from 'react';

import GroupedBeaconsTable from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeaconsTable';
import WebsiteGroupMetricsChart from 'in-websites/analyze/AnalyzeView/WebsiteGroupMetricsChart';
import getWebsiteBeaconGroups from 'in-subscription/websiteMonitoring/getWebsiteBeaconGroups';
import { availableMetrics, defaultMetrics } from 'in-websites/analyze/AnalyzeView/metrics';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import MetricSelector from 'in-analyze/components/MetricSelector';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { getChartGranularity } from 'in-applications/metrics';
import { analyzePath } from 'in-websites/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { dataSourceTitles } from 'in-websites/tags';
import Sticky from 'in-components/Sticky';
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
    getPathSegment: () => analyzePath,
    getMatrixPrefix: () => 'groups.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: 'beaconCountAgg',
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  withState('isChartSectionExpanded', 'setIsChartSectionExpanded', false),
  withProps(({ beaconType }) => ({
    setIsChartSectionExpanded: () => {
      setActiveDialog(
        <MetricSelector
          title="Select Metric Columns"
          help="Select which metrics should be available as columns within the table. It also defines which metrics could be viewed as graphs."
          availableMetrics={availableMetrics[beaconType]}
          selectedMetrics={defaultMetrics[beaconType]}
          maximumNumberOfMetrics={5}
          onSave={() => console.log('Save metric config')}
        />
      );
    }
  })),
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
            <QuickFilterBar showWebsiteSelector {...props} />
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
