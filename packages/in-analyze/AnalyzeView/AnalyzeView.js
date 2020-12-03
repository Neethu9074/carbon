import React, { useEffect } from 'react';

import {
  previewEnabled as previewEnabledMatrixParameter,
  showGraph as showGraphMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter,
  metrics as metricsMatrixParameter,
  deserializeMetrics,
  serializeMetrics
} from 'in-analyze/navigation/matrix';
import {
  analyze,
  setTagFilterExpressionAndHiddenCalls,
  setChartsMatrixParam,
  setGroupByMatrixParam,
  setMetricsMatrixParam,
  setDataSourceMatrixParam,
  setOrderByMatrixParam
} from 'in-analyze/navigation/paths';
import {
  getTagFilterFromUrlString,
  getTagFilterToUrlString,
  getGroupFromUrlString,
  getGroupToUrlString
} from 'in-analyze/filterBuilder';
import { getTagCatalog as getTracesTagCatalog } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import { getTagCatalog as getCallsTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { focusedMetric as focusedMetricMatrixParameter } from 'in-analyze/navigation/matrix';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import EmptyAnalyzeView from 'in-analyze/AnalyzeView/components/EmptyAnalyzeView';
import { updateLatencyFilters } from 'in-applications/analyze/utils/latencyUtils';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { groupAddedTracker, groupChangedTracker } from 'in-analyze/tracker';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import { getTagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { newAnalyticsEnabled } from 'in-services/featureFlags';
import { mutateUrl } from 'in-stores/navigation/navigation';
import getCalls from 'in-subscription/application/getCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import Analyze from 'in-applications/analyze/Analyze';
import RawCalls from 'in-analyze/components/RawCalls';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
  return getConfigByDataSource(dataSource).defaultGrouping || getConfigByDataSource('calls').defaultGrouping;
}

const urlStateConfig = {
  replaceHistory: false,
  bind: [
    {
      path: analyze,
      name: `callList.${dataSourceMatrixParameter}`,
      as: dataSourceMatrixParameter,
      initialState: 'calls'
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
    },
    {
      path: analyze,
      name: `groups.metrics`,
      as: metricsMatrixParameter,
      serializer: serializeMetrics,
      parser: deserializeMetrics
    }
  ]
};

export default function AnalyzeViewPropsEnrichment(props) {
  const isDialogActive = useObservable(
    activeDialogs$.map(dialogs => dialogs.length > 0),
    []
  );

  const timeConfig = useTimeConfig();
  const [urlState, onChangeAnalyzeConfig, onChangeAnalyzeConfigAndGetAsUrl] = useUrlState(urlStateConfig);

  urlState[focusedMetricMatrixParameter] = urlState[focusedMetricMatrixParameter] ?? initialFocusedMetric(props);
  urlState[groupByMatrixParameter] = urlState[groupByMatrixParameter] ?? getInitialGrouping(props);
  urlState[showGraphMatrixParameter] = urlState[showGraphMatrixParameter] ?? initialShowGraph(props);

  const { tagFilter, groupBy: group, dataSource, focusedMetric, metrics } = urlState;
  const filters = {
    tagFilter,
    group,
    dataSource,
    timeConfig
  };

  const isRawView = !group || !group.name;

  // Backwards Compatibility for UA1 links
  const tagCatalog = useTagCatalog(dataSource === 'traces' ? getTracesTagCatalog : getCallsTagCatalog);
  useEffect(() => {
    const locationInfo = props.location.matrix[analyze];
    const ua1Url = Boolean(locationInfo['callList.dataSource']);
    if (newAnalyticsEnabled && tagCatalog && ua1Url) {
      mutateUrl(location => {
        setDataSourceMatrixParam(location, dataSource);
        setMetricsMatrixParam(location, dataSource, metrics);
        setChartsMatrixParam(location, dataSource, focusedMetric);
        setGroupByMatrixParam(location, group);
        setTagFilterExpressionAndHiddenCalls(location, tagCatalog, tagFilter);
        // orderBy
        const prefix = isRawView ? 'rawItems' : 'groups';
        const orderBy = locationInfo[`${prefix}.orderBy`];
        const orderDirection = locationInfo[`${prefix}.orderDirection`];
        setOrderByMatrixParam(location, orderBy, orderDirection, group);

        // Reset all UA1 matrix parameters except of 'callList.dataSource' which will
        // be needed and eventually reset in the reset callback in the 'Analyze' component.
        setOrDeleteMatrixKey(location, analyze, 'callList.focusedMetric', null);
        setOrDeleteMatrixKey(location, analyze, 'callList.showGraph', null);
        setOrDeleteMatrixKey(location, analyze, 'callList.groupBy', null);
        setOrDeleteMatrixKey(location, analyze, 'callList.tagFilter', null);
        setOrDeleteMatrixKey(location, analyze, 'callList.previewEnabled', null);
        setOrDeleteMatrixKey(location, analyze, 'rawItems.orderBy', null);
        setOrDeleteMatrixKey(location, analyze, 'rawItems.orderDirection', null);
        setOrDeleteMatrixKey(location, analyze, 'groups.focusedMetric', null);
        setOrDeleteMatrixKey(location, analyze, 'groups.metrics', null);
        setOrDeleteMatrixKey(location, analyze, 'groups.showGraph', null);
        setOrDeleteMatrixKey(location, analyze, 'groups.orderBy', null);
        setOrDeleteMatrixKey(location, analyze, 'groups.orderDirection', null);
        setOrDeleteMatrixKey(location, analyze, 'ua2', null);
      });
    }
  }, [props.location, tagCatalog, dataSource, tagFilter, group, focusedMetric, metrics, isRawView]);

  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(
    tagFilter,
    getConfigByDataSource(dataSource).defaultFilters
  );

  const setTagFilters = tagFilters => onChangeAnalyzeConfig({ [tagFilterMatrixParameter]: tagFilters });

  return (
    <AnalyzeView
      {...props}
      {...getTagFilterManipulators({ ...props, filters, setTagFilters })}
      setTagFilters={setTagFilters}
      {...urlState}
      filters={filters}
      isRawView={isRawView}
      timeConfig={timeConfig}
      isDialogActive={isDialogActive}
      onChangeAnalyzeConfig={onChangeAnalyzeConfig}
      onChangeAnalyzeConfigAndGetAsUrl={onChangeAnalyzeConfigAndGetAsUrl}
      tagFiltersForSubscription={tagFiltersForSubscription}
    />
  );
}

function AnalyzeView(props) {
  const { isDialogActive, isRawView, dataSource, filters, setTagFilters } = props;

  useDisabledBodyScroll(isDialogActive);

  if (newAnalyticsEnabled) {
    return <Analyze />;
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
