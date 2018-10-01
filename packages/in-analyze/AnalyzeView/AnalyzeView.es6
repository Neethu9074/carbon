import { compose, defaultProps } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString,
  getShowRawFromUrlString,
  getShowRawToUrlString
} from 'in-analyze/filterBuilder';
import {
  showRawData as showRawDataMatrixParameter,
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import RawDataView from 'in-analyze/AnalyzeView/components/RawDataView/RawDataView';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/AnalyzeView/AnalyzeHeader';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import GroupedCalls from 'in-analyze/components/GroupedCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import RawCalls from 'in-analyze/components/RawCalls';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default compose(
  connectTo({
    activeDialog: activeDialog$
  }),
  defaultProps({
    replaceHistory: false
  }),
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [
      tagFilterMatrixParameter,
      dataSourceMatrixParameter
    ],
    getInitialState: () => ({
      [dataSourceMatrixParameter]: 'traces',
      [tagFilterMatrixParameter]: []
    }),
    reducerName: 'onChangeFilters',
    getParsedUrlValues: values => ({
      [dataSourceMatrixParameter]: values[dataSourceMatrixParameter],
      [tagFilterMatrixParameter]: getTagFilterFromUrlString(values[tagFilterMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [tagFilterMatrixParameter]: getTagFilterToUrlString(props[tagFilterMatrixParameter]),
      [dataSourceMatrixParameter]: props[dataSourceMatrixParameter]
    })
  }),
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [
      groupByMatrixParameter,
      showRawDataMatrixParameter,
    ],
    resets: [
      {
        getResettingProps: () => [dataSourceMatrixParameter],
        onReset: getInitialGrouping
      }
    ],
    getInitialState: getInitialGrouping,
    reducerName: 'onChangeGrouping',
    getParsedUrlValues: values => ({
      [showRawDataMatrixParameter]: getShowRawFromUrlString(values[showRawDataMatrixParameter]),
      [groupByMatrixParameter]: getGroupFromUrlString(values[groupByMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [groupByMatrixParameter]: getGroupToUrlString(props[groupByMatrixParameter]),
      [showRawDataMatrixParameter]: getShowRawToUrlString(props[showRawDataMatrixParameter])
    })
  })
)(AnalyzeView);

function getInitialGrouping({[dataSourceMatrixParameter]: dataSource}) {
  return {
    [groupByMatrixParameter]: dataSource === 'traces' ? { name: 'trace.name', value: '' } : { name: 'endpoint.name', value: '' }
  };
}

function AnalyzeView(props) {
  const { activeDialog, onChangeFilters, onChangeGrouping, location, totalHits } = props;
  let filters = fromJS({
    tagFilter: props[tagFilterMatrixParameter],
    group: props[groupByMatrixParameter],
    dataSource: props[dataSourceMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const rawDataGroup = getShowRawFromUrlString(getMatrixParameter(location, analyze, showRawDataMatrixParameter));
  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(props[tagFilterMatrixParameter]);
  const dataSource = props[dataSourceMatrixParameter];
  const isTracesDataSource = dataSource === 'traces';

  return (
    <Fragment>
      <Title title="Analyze" />

      <Switch>
        <Route
          path="*/raw"
          render={() => {
            return (
              <RawDataView
                {...props}
                rawListComponent={isTracesDataSource ? RawTraces : RawCalls}
                filters={filters}
                onChangeFilters={onChangeFilters}
                tagFiltersForSubscription={tagFiltersForSubscription}
                filterByGroup={rawDataGroup}
              />
            );
          }}
        />

        <Route
          path="*/"
          render={() => {
            return (
              <Fragment>
                <AnalyzeHeader onChangeFilters={onChangeFilters} dataSource={dataSource} />
                <QueryBuilderWorkspace
                  filters={filters}
                  onChangeFilters={onChangeFilters}
                  onChangeGrouping={onChangeGrouping}
                  totalNumberOfCalls={totalHits}
                />

                <MaxWidthFullscreenContainer>
                  {isTracesDataSource ? (
                    <GroupedTraces {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
                  ) : (
                    <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
                  )}
                </MaxWidthFullscreenContainer>
                {activeDialog && <DisabledBodyScroll />}
              </Fragment>
            );
          }}
        />
      </Switch>
    </Fragment>
  );
}
