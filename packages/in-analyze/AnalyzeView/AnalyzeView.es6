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
      groupByMatrixParameter,
      showRawDataMatrixParameter,
      dataSourceMatrixParameter
    ],
    getResettingProps: () => [],
    getInitialState: () => {
      const initialState = {
        dataSource: 'traces'
      };
      initialState[tagFilterMatrixParameter] = [];
      return initialState;
    },
    reducerName: 'onChangeFilters',
    getParsedUrlValues: values => {
      const urlFilters = values[tagFilterMatrixParameter];
      const tagFilter = getTagFilterFromUrlString(urlFilters);

      const urlGroup = values[groupByMatrixParameter];
      const group = getGroupFromUrlString(urlGroup);

      const urlShowRawActive = values[showRawDataMatrixParameter];
      const showRawActive = getShowRawFromUrlString(urlShowRawActive);

      const dataSource = values[dataSourceMatrixParameter];

      const objectToReturn = {};
      objectToReturn[showRawDataMatrixParameter] = showRawActive;
      objectToReturn[dataSourceMatrixParameter] = dataSource;
      objectToReturn[tagFilterMatrixParameter] = tagFilter;
      objectToReturn[groupByMatrixParameter] = group;
      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const group = props[groupByMatrixParameter];
      const urlReadyGroup = getGroupToUrlString(group);

      const showRawActive = props[showRawDataMatrixParameter];
      const urlReadyShowRawActive = getShowRawToUrlString(showRawActive);

      const dataSource = props[dataSourceMatrixParameter];
      const urlReadyDataSource = dataSource;

      const objectToStore = {};
      objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
      objectToStore[groupByMatrixParameter] = urlReadyGroup;
      objectToStore[showRawDataMatrixParameter] = urlReadyShowRawActive;
      objectToStore[dataSourceMatrixParameter] = urlReadyDataSource;
      return objectToStore;
    }
  })
)(AnalyzeView);

function AnalyzeView(props) {
  const { activeDialog, onChangeFilters, location, totalHits } = props;

  const tagFilter = props[tagFilterMatrixParameter];
  let filters = fromJS({
    tagFilter,
    group: props[groupByMatrixParameter] || { name: 'endpoint.name', value: '' },
    dataSource: props[dataSourceMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const rawDataGroup = getShowRawFromUrlString(getMatrixParameter(location, analyze, showRawDataMatrixParameter));
  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(tagFilter);
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
