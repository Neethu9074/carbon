import { compose, withPropsOnChange } from 'recompose';
import { fromJS } from 'immutable';

import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString
} from 'in-analyze/filterBuilder';
import {
  dataSource as dataSourceMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';

export function getConfigHocs() {
  return compose(
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
  );
}

function getInitialGrouping({ [dataSourceMatrixParameter]: dataSource }) {
  return {
    [groupByMatrixParameter]:
      dataSource === 'traces' ? { name: 'trace.name', value: '' } : { name: 'endpoint.name', value: '' }
  };
}
