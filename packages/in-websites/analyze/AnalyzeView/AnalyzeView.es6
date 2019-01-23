import { compose, withProps } from 'recompose';
import React from 'react';

import {
  analyzeMetricsUrlParameter,
  analyzeOrderByUrlParameter,
  analyzeOrderDirectionUrlParameter,
  analyzeTagFiltersUrlParameter,
  analyzeGroupingUrlParameter,
  analyzeBeaconTypeUrlParameter
} from 'in-websites/navigation/urlParameters';
import {} from 'in-websites/analyze/AnalyzeView/metrics';
import WebsiteEditGroupDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditGroupDialog';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeacons';
import { availableGroupingTags, availableFilterTags } from 'in-websites/tags';
import Beacons from 'in-websites/analyze/AnalyzeView/Beacons/Beacons';
import {
  availableMetrics as allAvailableMetrics,
  defaultMetrics,
  timestampMetricName,
  groupCountMetricName,
  buildOrderByCriteria
} from 'in-websites/analyze/AnalyzeView/metrics';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import MetricSelector from 'in-analyze/components/MetricSelector';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import { addGroupToTagFilter } from 'in-analyze/filterBuilder';
import { getTag } from 'in-analyze/metricDefinitionHelpers';
import { changeAnalyzeMetrics } from 'in-websites/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';

export default compose(
  withUrlState({
    bind: [
      analyzeTagFiltersUrlParameter,
      analyzeGroupingUrlParameter,
      analyzeBeaconTypeUrlParameter,
      analyzeMetricsUrlParameter,
      {
        ...analyzeOrderByUrlParameter,
        initialState: null
      },
      {
        ...analyzeOrderDirectionUrlParameter,
        initialState: null
      }
    ],
    reducerName: 'onChange',
    reduceAndGetAsUrlName: 'getChangeAsUrl',
    replaceState: false
  }),
  withProps(({ tagFilters, beaconType, group, metrics, orderBy, orderDirection, onChange }) => {
    const isGroupedView = group && !!group.groupbyTag;
    const implicitTagFilters = [
      {
        name: 'beacon.type',
        operator: 'EQUALS',
        stringValue: beaconType
      }
    ];

    const defaultOrderBy = isGroupedView ? groupCountMetricName : timestampMetricName;
    orderBy = orderBy || defaultOrderBy;
    orderDirection = orderDirection || 'DESC';

    const availableMetrics = allAvailableMetrics[beaconType];
    const configuredMetrics = metrics || defaultMetrics[beaconType];
    const metricsToShow = isGroupedView
      ? configuredMetrics
      : configuredMetrics.filter(m => getTag(availableMetrics, m.metric));

    return {
      isGroupedView,
      tagFilters: tagFilters.concat(implicitTagFilters),
      orderBy,
      orderDirection,
      implicitTagFilters,
      configuredMetrics,
      metrics: metricsToShow,
      availableMetrics,
      onChangeOrder: onChange,
      openMetricSelector: () => {
        setActiveDialog(
          <MetricSelector
            title="Select Metrics"
            help="Select which metrics should be available as columns within the table. It also defines which metrics could be viewed as graphs."
            availableMetrics={availableMetrics}
            selectedMetrics={configuredMetrics}
            maximumNumberOfMetrics={5}
            isGroupedView={isGroupedView}
            onSave={metrics => {
              const orderByMetricStillExists = metrics.reduce(
                (agg, { metric, aggregation }) => agg || orderBy === buildOrderByCriteria(metric, aggregation),
                false
              );
              changeAnalyzeMetrics({
                beaconType,
                metrics: JSON.stringify(metrics)
              });
              onChange({
                metrics,
                orderBy: orderByMetricStillExists ? orderBy : defaultOrderBy,
                orderDirection: orderByMetricStillExists ? orderDirection : 'DESC'
              });
            }}
          />
        );
      }
    };
  }),
  withProps(({ onChange, location, beaconType, implicitTagFilters }) => ({
    setTagFilters: tagFilters => onChange({ tagFilters: tagFilters.filter(f => implicitTagFilters.indexOf(f) === -1) }),
    setGroup: group => onChange({ group }),
    disableGrouping: () => onChange({ group: {} }),
    timeConfig: getTimeConfig(location),
    groupableTags: availableGroupingTags[beaconType],
    filterableTags: availableFilterTags[beaconType]
  })),
  withProps(({ group, setGroup, timeConfig, tagFilters, implicitTagFilters, getChangeAsUrl, groupableTags }) => ({
    openEditGroupDialog() {
      setActiveDialog(
        <WebsiteEditGroupDialog
          setGroup={setGroup}
          group={group}
          tagSuggestions={groupableTags}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
        />
      );
    },
    getGroupAsFilterUrl: subGroupName =>
      getChangeAsUrl({
        tagFilters: addGroupToTagFilter(
          tagFilters.filter(f => implicitTagFilters.indexOf(f) === -1),
          group,
          subGroupName
        ),
        group: {}
      })
  })),
  tagFilterManipulators
)(AnalyzeView);

function AnalyzeView(props) {
  if (props.group.groupbyTag) {
    return <GroupedBeacons {...props} />;
  }

  // key defined to force a complete state reset
  return <Beacons key={props.beaconType} {...props} />;
}
