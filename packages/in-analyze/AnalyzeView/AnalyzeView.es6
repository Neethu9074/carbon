import { compose, withPropsOnChange } from 'recompose';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString
} from 'in-analyze/filterBuilder';
import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import AnalyzeHeader from 'in-analyze/AnalyzeView/AnalyzeHeader';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import GroupedCalls from 'in-analyze/components/GroupedCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import RawCalls from 'in-analyze/components/RawCalls';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default compose(
  connectTo({
    activeDialog: activeDialog$
  }),
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [dataSourceMatrixParameter],
    getInitialState: () => ({
      [dataSourceMatrixParameter]: 'traces'
    }),
    reducerName: 'onChangeDataSource',
    getParsedUrlValues: values => ({
      [dataSourceMatrixParameter]: values[dataSourceMatrixParameter]
    }),
    getSerializedUrlValues: props => ({
      [dataSourceMatrixParameter]: props[dataSourceMatrixParameter]
    })
  }),
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [groupByMatrixParameter, tagFilterMatrixParameter],
    resets: [
      {
        getResettingProps: () => [dataSourceMatrixParameter],
        onReset: getInitialGrouping
      }
    ],
    getInitialState: props => ({
      ...getInitialGrouping(props),
      [tagFilterMatrixParameter]: []
    }),
    reducerName: 'onChangeAnalyzeConfig',
    getParsedUrlValues: values => ({
      [groupByMatrixParameter]: getGroupFromUrlString(values[groupByMatrixParameter]),
      [tagFilterMatrixParameter]: getTagFilterFromUrlString(values[tagFilterMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [groupByMatrixParameter]: getGroupToUrlString(props[groupByMatrixParameter]),
      [tagFilterMatrixParameter]: getTagFilterToUrlString(props[tagFilterMatrixParameter])
    })
  }),
  withPropsOnChange(
    ['location', tagFilterMatrixParameter, groupByMatrixParameter, dataSourceMatrixParameter],
    ({
      location,
      [tagFilterMatrixParameter]: tagFilter,
      [groupByMatrixParameter]: group,
      [dataSourceMatrixParameter]: dataSource
    }) => ({
      filters: fromJS({
        tagFilter,
        group,
        dataSource
      })
        // ensure that timeConfig keeps being the mutable version
        .set('timeConfig', getTimeConfig(location)),
      tagFiltersForSubscription: getTagFilterListForBackendSubscription(tagFilter),
      isRawView: !group || !group.name,
      isTracesDataSource: dataSource === 'traces'
    })
  )
)(AnalyzeView);

function AnalyzeView(props) {
  const {
    activeDialog,
    onChangeAnalyzeConfig,
    onChangeDataSource,
    filters,
    isRawView,
    isTracesDataSource,
    dataSource
  } = props;

  return (
    <Fragment>
      <Title title={isTracesDataSource ? 'Analyze Traces' : 'Analyze Calls'} />

      <AnalyzeHeader onChangeDataSource={onChangeDataSource} dataSource={dataSource} />
      <QueryBuilderWorkspace filters={filters} onChangeAnalyzeConfig={onChangeAnalyzeConfig} />

      <MaxWidthFullscreenContainer>
        {isRawView ? (
          isTracesDataSource ? (
            <RawTraces {...props} filters={filters} />
          ) : (
            <RawCalls {...props} filters={filters} />
          )
        ) : isTracesDataSource ? (
          <GroupedTraces {...props} filters={filters} />
        ) : (
          <GroupedCalls {...props} filters={filters} />
        )}
      </MaxWidthFullscreenContainer>

      {activeDialog && <DisabledBodyScroll />}
    </Fragment>
  );
}

function getInitialGrouping({ [dataSourceMatrixParameter]: dataSource }) {
  return {
    [groupByMatrixParameter]:
      dataSource === 'traces' ? { name: 'trace.name', value: '' } : { name: 'endpoint.name', value: '' }
  };
}
