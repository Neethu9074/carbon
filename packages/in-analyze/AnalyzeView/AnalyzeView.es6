import { compose, defaultProps } from 'recompose';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString
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
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
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
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [groupByMatrixParameter, showRawDataMatrixParameter, tagFilterMatrixParameter],
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
  })
)(AnalyzeView);

function getInitialGrouping({ [dataSourceMatrixParameter]: dataSource }) {
  return {
    [groupByMatrixParameter]:
      dataSource === 'traces' ? { name: 'trace.name', value: '' } : { name: 'endpoint.name', value: '' }
  };
}

function AnalyzeView(props) {
  const { activeDialog, onChangeAnalyzeConfig, onChangeDataSource, location, totalHits } = props;
  let filters = fromJS({
    tagFilter: props[tagFilterMatrixParameter],
    group: props[groupByMatrixParameter],
    dataSource: props[dataSourceMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(props[tagFilterMatrixParameter]);
  const dataSource = props[dataSourceMatrixParameter];
  const isTracesDataSource = dataSource === 'traces';
  const isRawView = !filters.getIn(['group', 'name']);

  return (
    <Fragment>
      <Title title={isTracesDataSource ? 'Analyze Traces' : 'Analyze Calls'} />

      <AnalyzeHeader onChangeDataSource={onChangeDataSource} dataSource={dataSource} />
      <QueryBuilderWorkspace
        filters={filters}
        onChangeAnalyzeConfig={onChangeAnalyzeConfig}
        totalNumberOfCalls={totalHits}
      />

      <MaxWidthFullscreenContainer>
        {isRawView ? (
          isTracesDataSource ? (
            <RawTraces {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
          ) : (
            <RawCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
          )
        ) : isTracesDataSource ? (
          <GroupedTraces {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
        ) : (
          <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
        )}
      </MaxWidthFullscreenContainer>

      {activeDialog && <DisabledBodyScroll />}
    </Fragment>
  );
}
