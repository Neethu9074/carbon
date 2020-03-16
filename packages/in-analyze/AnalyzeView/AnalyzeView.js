import { compose, withProps, withPropsOnChange } from 'recompose';
import React from 'react';

import {
  previewEnabled as previewEnabledMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getPreviewEnabledFromUrlString,
  getPreviewEnabledToUrlString,
  getTagFilterFromUrlString,
  getTagFilterToUrlString,
  getGroupFromUrlString,
  getGroupToUrlString
} from 'in-analyze/filterBuilder';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import EmptyAnalyzeView from 'in-analyze/AnalyzeView/components/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { groupAddedTracker, groupChangedTracker } from 'in-analyze/tracker';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { tagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import getCalls from 'in-subscription/application/getCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import RawCalls from 'in-analyze/components/RawCalls';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo({
    isDialogActive: activeDialogs$.map(dialogs => dialogs.length > 0)
  }),
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [
      dataSourceMatrixParameter,
      groupByMatrixParameter,
      tagFilterMatrixParameter,
      previewEnabledMatrixParameter
    ],
    getInitialState: props => ({
      [dataSourceMatrixParameter]: 'traces',
      ...getInitialGrouping(props),
      [tagFilterMatrixParameter]: [],
      [previewEnabledMatrixParameter]: false
    }),
    reducerName: 'onChangeAnalyzeConfig',
    getParsedUrlValues: values => ({
      [dataSourceMatrixParameter]: values[dataSourceMatrixParameter],
      [groupByMatrixParameter]: getGroupFromUrlString(values[groupByMatrixParameter]),
      [tagFilterMatrixParameter]: getTagFilterFromUrlString(values[tagFilterMatrixParameter]),
      [previewEnabledMatrixParameter]: getPreviewEnabledFromUrlString(values[previewEnabledMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [dataSourceMatrixParameter]: props[dataSourceMatrixParameter],
      [groupByMatrixParameter]: getGroupToUrlString(props[groupByMatrixParameter]),
      [tagFilterMatrixParameter]: getTagFilterToUrlString(props[tagFilterMatrixParameter]),
      [previewEnabledMatrixParameter]: getPreviewEnabledToUrlString(props[previewEnabledMatrixParameter])
    })
  }),
  withPropsOnChange(
    [
      'location',
      tagFilterMatrixParameter,
      groupByMatrixParameter,
      dataSourceMatrixParameter,
      previewEnabledMatrixParameter
    ],
    ({
      location,
      [tagFilterMatrixParameter]: tagFilter,
      [groupByMatrixParameter]: group,
      [dataSourceMatrixParameter]: dataSource,
      [previewEnabledMatrixParameter]: previewEnabledMatrixParameter
    }) => ({
      filters: {
        tagFilter,
        group,
        dataSource,
        timeConfig: getTimeConfig(location)
      },
      tagFiltersForSubscription: getTagFilterListForBackendSubscription(
        tagFilter,
        getConfigByDataSource(dataSource).defaultFilters
      ),
      isRawView: !group || !group.name
    })
  ),
  withProps(({ onChangeAnalyzeConfig, location }) => ({
    timeConfig: getTimeConfig(location),
    setTagFilters(tagFilters) {
      onChangeAnalyzeConfig({
        [tagFilterMatrixParameter]: tagFilters
      });
    }
  })),
  tagFilterManipulators
)(AnalyzeView);

function AnalyzeView(props) {
  const { isDialogActive, isRawView, dataSource, filters } = props;
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
      {isDialogActive && <DisabledBodyScroll />}
      {
        <View
          {...props}
          onPreviewEnabledChange={value => {
            const newState = {};
            newState[previewEnabledMatrixParameter] = value;
            props.onChangeAnalyzeConfig(newState);
          }}
          openEditGroupDialog={() =>
            setActiveDialog(
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

function getInitialGrouping({ [dataSourceMatrixParameter]: dataSource }) {
  return {
    [groupByMatrixParameter]:
      getConfigByDataSource(dataSource).defaultGrouping || getConfigByDataSource('traces').defaultGrouping
  };
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
