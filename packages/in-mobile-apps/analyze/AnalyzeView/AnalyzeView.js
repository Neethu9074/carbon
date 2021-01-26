/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps } from 'recompose';
import React, { Fragment } from 'react';
import { uniqBy } from 'lodash';
import { t } from 'in-i18n';

import {
  analyzeMetricsUrlParameter,
  analyzeOrderByUrlParameter,
  analyzeOrderDirectionUrlParameter,
  analyzeTagFiltersUrlParameter,
  analyzeGroupingUrlParameter,
  analyzeBeaconTypeUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import {
  availableMetrics as allAvailableMetrics,
  defaultMetrics,
  timestampMetricName,
  groupCountMetricName,
  buildOrderByCriteria
} from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import {
  changeAnalyzeMetrics,
  analyzeTagFilters as tagFiltersTrackers,
  analyzeGrouping as groupingTrackers
} from 'in-mobile-apps/tracker';
import MobileAppEditGroupDialog from 'in-mobile-apps/analyze/AnalyzeView/MobileAppEditGroupDialog';
import GroupedBeacons from 'in-mobile-apps/analyze/AnalyzeView/GroupedBeacons/GroupedBeacons';
import EmptyAnalyzeView from 'in-mobile-apps/analyze/AnalyzeView/EmptyAnalyzeView';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { availableGroupingTags, availableFilterTags } from 'in-mobile-apps/tags';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import Beacons from 'in-mobile-apps/analyze/AnalyzeView/Beacons/Beacons';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { tagFilterManipulators } from 'in-mobile-apps/tagFiltersHoc';
import MetricSelector from 'in-analyze/components/MetricSelector';
import { addGroupToTagFilter } from 'in-analyze/filterBuilder';
import { getTag } from 'in-analyze/metricDefinitionHelpers';
import { getTimeConfig } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';

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
        name: 'mobileBeacon.type',
        operator: 'EQUALS',
        stringValue: beaconType
      }
    ];

    const defaultOrderBy = isGroupedView ? groupCountMetricName : timestampMetricName;
    orderBy = orderBy || defaultOrderBy;
    orderDirection = orderDirection || 'DESC';

    const availableMetrics = allAvailableMetrics[beaconType];
    const configuredMetrics = metrics || defaultMetrics[beaconType];
    const configuredRawDataSupportedMetrics = configuredMetrics.filter(m => getTag(availableMetrics, m.metric));
    const metricsToShow = isGroupedView
      ? configuredMetrics
      : uniqBy(configuredRawDataSupportedMetrics, m => getTag(availableMetrics, m.metric));

    return {
      isGroupedView,
      tagFilters: tagFilters.concat(implicitTagFilters),
      orderBy,
      orderDirection,
      implicitTagFilters,
      configuredMetrics,
      configuredRawDataSupportedMetrics,
      metrics: metricsToShow,
      availableMetrics,
      onChangeOrder: onChange,
      openMetricSelector: () => {
        addActiveDialog(
          <MetricSelector
            title={t('in-mobile-apps:analyzeView.MetricSelectorTitle')}
            help={t('in-mobile-apps:analyzeView.MetricSelectorHelp')}
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
                metrics: metrics
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
  withProps(
    ({
      tagFilters: existingTagFilters,
      onChange,
      location,
      orderBy,
      orderDirection,
      beaconType,
      implicitTagFilters,
      configuredRawDataSupportedMetrics
    }) => ({
      setTagFilters: tagFilters =>
        onChange({ tagFilters: tagFilters.filter(f => implicitTagFilters.indexOf(f) === -1) }),
      setGroup: group => {
        onChange({ group });
        if (!group || !group.groupbyTag) {
          groupingTrackers.remove({
            filters: existingTagFilters
          });
        } else {
          groupingTrackers.set({
            group: group,
            filters: existingTagFilters
          });
        }
      },
      disableGrouping: () => {
        const orderCriteriaStillSupported = isOrderCriteriaSupportedForUngroupedView(
          orderBy,
          configuredRawDataSupportedMetrics
        );
        groupingTrackers.remove();
        onChange({
          group: {},
          orderBy: orderCriteriaStillSupported ? orderBy : timestampMetricName,
          orderDirection: orderCriteriaStillSupported ? orderDirection : 'DESC'
        });
      },
      timeConfig: getTimeConfig(location),
      groupableTags: availableGroupingTags[beaconType],
      filterableTags: availableFilterTags[beaconType]
    })
  ),
  withProps(
    ({
      group,
      setGroup,
      timeConfig,
      tagFilters,
      implicitTagFilters,
      getChangeAsUrl,
      groupableTags,
      orderBy,
      orderDirection,
      configuredRawDataSupportedMetrics
    }) => ({
      openEditGroupDialog() {
        addActiveDialog(
          <MobileAppEditGroupDialog
            setGroup={setGroup}
            group={group}
            tagSuggestions={groupableTags}
            timeConfig={timeConfig}
            tagFilters={tagFilters}
          />
        );
      },
      getGroupAsFilterUrl: subGroupName => {
        const orderCriteriaStillSupported = isOrderCriteriaSupportedForUngroupedView(
          orderBy,
          configuredRawDataSupportedMetrics
        );
        return getChangeAsUrl({
          tagFilters: addGroupToTagFilter(
            tagFilters.filter(f => implicitTagFilters.indexOf(f) === -1),
            group,
            subGroupName
          ),
          group: {},
          orderBy: orderCriteriaStillSupported ? orderBy : timestampMetricName,
          orderDirection: orderCriteriaStillSupported ? orderDirection : 'DESC'
        });
      }
    })
  ),
  tagFilterManipulators({ tagFiltersTrackers })
)(props => (
  <WithEmptyStateFallback
    center={false}
    getHasDataToRender={() => getHasDataToRender(props)}
    FallbackComponent={EmptyAnalyzeView}
    type={props.beaconType}
  >
    <AnalyzeView {...props} />
  </WithEmptyStateFallback>
));

function AnalyzeView(props) {
  return (
    <Fragment>
      {props.group.groupbyTag ? <GroupedBeacons {...props} /> : <Beacons key={props.beaconType} {...props} /> // key defined to force a complete state reset
      }
      <Footer />
    </Fragment>
  );
}

function isOrderCriteriaSupportedForUngroupedView(orderBy, metrics) {
  return metrics.reduce((agg, { metric }) => agg || orderBy.indexOf(metric) === 0, false);
}

function getHasDataToRender({ timeConfig }) {
  return getMobileAppBeacons({
    pagination: {
      cursor: null,
      retrievalSize: 1
    },
    order: {
      by: 'mobileBeacon.timestamp',
      direction: 'DESC'
    },
    timeConfig,
    tagFilters: []
  }).map(result => !result.data || result.data.totalHits > 0);
}
