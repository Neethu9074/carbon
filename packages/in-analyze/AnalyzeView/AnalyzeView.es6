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
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo({
    activeDialog: activeDialog$
  }),
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'callList.',
    boundKeys: [dataSourceMatrixParameter, groupByMatrixParameter, tagFilterMatrixParameter],
    getInitialState: props => ({
      [dataSourceMatrixParameter]: 'traces',
      ...getInitialGrouping(props),
      [tagFilterMatrixParameter]: []
    }),
    reducerName: 'onChangeAnalyzeConfig',
    getParsedUrlValues: values => ({
      [dataSourceMatrixParameter]: values[dataSourceMatrixParameter],
      [groupByMatrixParameter]: getGroupFromUrlString(values[groupByMatrixParameter]),
      [tagFilterMatrixParameter]: getTagFilterFromUrlString(values[tagFilterMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [dataSourceMatrixParameter]: props[dataSourceMatrixParameter],
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
      isRawView: !group || !group.name
    })
  )
)(AnalyzeView);

function AnalyzeView(props) {
  const { activeDialog, isRawView, filters } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));

  return (
    <Fragment>
      {activeDialog && <DisabledBodyScroll />}
      {isRawView ? <dataSourceConfig.RawView {...props} /> : <dataSourceConfig.GroupedView {...props} />}
    </Fragment>
  );
}

function getInitialGrouping({ [dataSourceMatrixParameter]: dataSource }) {
  return getConfigByDataSource(dataSource).defaultGrouping;
}
