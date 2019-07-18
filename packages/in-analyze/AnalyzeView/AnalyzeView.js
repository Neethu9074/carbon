import { compose, withProps, withPropsOnChange } from 'recompose';
import React from 'react';

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
import EmptyAnalyzeView from 'in-analyze/AnalyzeView/components/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { tagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import getCalls from 'in-subscription/application/getCalls';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import Footer from 'in-new-components/Footer';
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
  const { activeDialog, isRawView, dataSource, filters } = props;
  const dataSourceConfig = getConfigByDataSource(filters.dataSource);
  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() => getHasDataToRender(props)}
      FallbackComponent={EmptyAnalyzeView}
      type={dataSource}
    >
      {activeDialog && <DisabledBodyScroll />}
      {isRawView ? <dataSourceConfig.RawView {...props} /> : <dataSourceConfig.GroupedView {...props} />}

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
