import { useRouteMatch } from 'react-router';
import React from 'react';

import {
  previewEnabled as previewEnabledMatrixParameter,
  showGraph as showGraphMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getTagFilterFromUrlString,
  getTagFilterToUrlString,
  getGroupFromUrlString,
  getGroupToUrlString
} from 'in-analyze/filterBuilder';
import { updateLatencyFilters } from 'in-new-components/LatencyDistributionBase10Chart/latencyUtils';
import { focusedMetric as focusedMetricMatrixParameter } from 'in-analyze/navigation/matrix';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import EmptyAnalyzeView from 'in-analyze/AnalyzeView/components/EmptyAnalyzeView';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { groupAddedTracker, groupChangedTracker } from 'in-analyze/tracker';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import { getTagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import getCalls from 'in-subscription/application/getCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import Analyze from 'in-applications/analyze/Analyze';
import RawCalls from 'in-analyze/components/RawCalls';
import { getTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';

function initialShowGraph(props) {
  // Support for old URLs with a deprecated matrix parameter 'groups.showGraph'. In the past UA charts were
  // available only for grouped calls and traces. When the charts were introduced also for ungrouped calls
  // and traces, the matrix parameter was changed to 'callList.showGraph'.
  const matrixAnalyze = props.history.location.matrix[analyze];
  if (matrixAnalyze != null) {
    const groupsShowGraph = matrixAnalyze['groups.showGraph'];
    const callListShowGraph = matrixAnalyze['callList.showGraph'];
    if (groupsShowGraph != null && callListShowGraph == null) {
      return groupsShowGraph === 'true' ? true : false;
    }
  }
  return false;
}

function initialFocusedMetric(props) {
  // Support for old URLs with a deprecated matrix parameter 'groups.focusedMetric'. In the past UA charts were
  // available only for grouped calls and traces. When the charts were introduced also for ungrouped calls
  // and traces, the matrix parameter was changed to 'callList.focusedMetric'.
  const matrixAnalyze = props.history.location.matrix[analyze];
  if (matrixAnalyze != null) {
    const groupsFocusedMetric = matrixAnalyze['groups.focusedMetric'];
    const callListFocusedMetric = matrixAnalyze['callList.focusedMetric'];
    if (groupsFocusedMetric != null && callListFocusedMetric == null) {
      return groupsFocusedMetric;
    }
  }
  return null;
}

function getInitialGrouping(props) {
  const dataSource = props[dataSourceMatrixParameter];
  return getConfigByDataSource(dataSource).defaultGrouping || getConfigByDataSource('traces').defaultGrouping;
}

const urlStateConfig = {
  replaceHistory: false,
  bind: [
    {
      path: analyze,
      name: `callList.${dataSourceMatrixParameter}`,
      as: dataSourceMatrixParameter,
      initialState: 'traces'
    },
    {
      path: analyze,
      name: `callList.${focusedMetricMatrixParameter}`,
      as: focusedMetricMatrixParameter
    },
    {
      path: analyze,
      name: `callList.${groupByMatrixParameter}`,
      as: groupByMatrixParameter,
      parser: getGroupFromUrlString,
      serializer: getGroupToUrlString
    },
    {
      path: analyze,
      name: `callList.${tagFilterMatrixParameter}`,
      as: tagFilterMatrixParameter,
      initialState: [],
      parser: getTagFilterFromUrlString,
      serializer: getTagFilterToUrlString
    },
    {
      path: analyze,
      name: `callList.${showGraphMatrixParameter}`,
      as: showGraphMatrixParameter,
      parser: v => (v === 'false' ? false : true),
      serializer: Boolean
    }
  ]
};

export default function AnalyzeViewPropsEnrichment(props) {
  const isDialogActive = useObservable(
    activeDialogs$.map(dialogs => dialogs.length > 0),
    []
  );

  const [urlState, onChangeAnalyzeConfig] = useUrlState(urlStateConfig);
  urlState[focusedMetricMatrixParameter] = urlState[focusedMetricMatrixParameter] ?? initialFocusedMetric(props);
  urlState[groupByMatrixParameter] = urlState[groupByMatrixParameter] ?? getInitialGrouping(props);
  urlState[showGraphMatrixParameter] = urlState[showGraphMatrixParameter] ?? initialShowGraph(props);

  const timeConfig = getTimeConfig(props.location);
  const { tagFilter, group, dataSource } = urlState;
  const filters = {
    tagFilter,
    group,
    dataSource,
    timeConfig
  };
  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(
    tagFilter,
    getConfigByDataSource(dataSource).defaultFilters
  );
  const isRawView = !group || !group.name;

  const setTagFilters = tagFilters => onChangeAnalyzeConfig({ [tagFilterMatrixParameter]: tagFilters });

  return (
    <AnalyzeView
      {...props}
      {...getTagFilterManipulators({ ...props, filters, setTagFilters })}
      {...urlState}
      filters={filters}
      isRawView={isRawView}
      timeConfig={timeConfig}
      isDialogActive={isDialogActive}
      onChangeAnalyzeConfig={onChangeAnalyzeConfig}
      tagFiltersForSubscription={tagFiltersForSubscription}
    />
  );
}

function AnalyzeView(props) {
  const { isDialogActive, isRawView, dataSource, filters, setTagFilters } = props;

  useDisabledBodyScroll(isDialogActive);

  const showTraceDetails = useRouteMatch(traceDetailFullyQualified);
  // Eventually this will only route to the new analyze view and the rest of this
  // component can be removed.
  if (dataSource === 'callsUQB') {
    if (showTraceDetails) {
      // To show trace details, hijack the datasource to use RawCalls
      filters.dataSource = 'calls';
    } else {
      return <Analyze />;
    }
  }

  // Deliberately not part of the dataSources, as this would result in inclusion of the analyze views
  // in the index bundle.
  let View = GroupedTraces;
  if (isRawView) {
    if (filters.dataSource === 'traces') {
      View = RawTraces;
    } else {
      View = RawCalls;
    }
  }

  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() => getHasDataToRender(props)}
      FallbackComponent={EmptyAnalyzeView}
      type={dataSource}
    >
      {
        <View
          {...props}
          onPreviewEnabledChange={value => {
            const newState = {};
            newState[previewEnabledMatrixParameter] = value;
            props.onChangeAnalyzeConfig(newState);
          }}
          onShowGraphChange={value => {
            const newState = {};
            newState[showGraphMatrixParameter] = value;
            props.onChangeAnalyzeConfig(newState);
          }}
          onFocusedMetricChange={value => {
            const newState = {};
            newState[focusedMetricMatrixParameter] = value;
            props.onChangeAnalyzeConfig(newState);
          }}
          onLatencySelectionChanged={latencySelection =>
            setTagFilters(updateLatencyFilters(filters.dataSource, filters.tagFilter, latencySelection))
          }
          openEditGroupDialog={() =>
            addActiveDialog(
              <EditGroupDialog
                {...props}
                tagFilters={props.tagFilter}
                timeConfig={props.timeConfig}
                group={props.group}
                setGroup={_group => {
                  if (!props.group || !props.group.name) {
                    groupAddedTracker({ group: _group.groupbyTag });
                  } else {
                    groupChangedTracker({ before: props.group.name, after: _group.groupbyTag });
                  }
                  const newState = {};
                  newState[groupByMatrixParameter] = {
                    name: _group.groupbyTag,
                    value: _group.groupbyTagSecondLevelKey,
                    entity: _group.entity
                  };
                  props.onChangeAnalyzeConfig(newState);
                }}
                forAnalyzeCalls
              />
            )
          }
        />
      }
      <Footer />
    </WithEmptyStateFallback>
  );
}

function getHasDataToRender({ timeConfig }) {
  return getCalls({
    pagination: {
      cursor: null,
      retrievalSize: 1
    },
    order: {
      by: 'timestamp',
      direction: 'DESC'
    },
    filter: {
      timeConfig
    },
    tagFilters: []
  }).map(result => !result.data || result.data.totalHits > 0);
}
