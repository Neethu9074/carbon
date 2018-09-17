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
  getDataSourceFromUrlString,
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
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './AnalyzeView.mless';

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
      const dataSource = getDataSourceFromUrlString(urlShowRawActive);

      const objectToReturn = {};
      objectToReturn[tagFilterMatrixParameter] = tagFilter;
      objectToReturn[groupByMatrixParameter] = group;
      objectToReturn[showRawDataMatrixParameter] = showRawActive;
      objectToReturn[dataSourceMatrixParameter] = dataSource;
      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const group = props[groupByMatrixParameter];
      const urlReadyGroup = getGroupToUrlString(group);

      const showRawActive = props[showRawDataMatrixParameter];
      const urlReadyShowRawActive = getShowRawToUrlString(showRawActive);

      const urlReadyDataSource = props[showRawDataMatrixParameter];

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
  const filters = fromJS({
    tagFilter,
    group: props[groupByMatrixParameter] || { name: 'endpoint.name', value: '' },
    dataSource: props[dataSourceMatrixParameter],
    timeConfig: getTimeConfig(location)
  });

  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(tagFilter);

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
                filters={filters}
                onChangeFilters={onChangeFilters}
                tagFiltersForSubscription={tagFiltersForSubscription}
                filterByGroup={props[showRawDataMatrixParameter]}
              />
            );
          }}
        />
        <Route
          path="*/"
          render={() => {
            return (
              <Sticky header={<AnalyzeHeader />}>
                <Fragment>
                  <QueryBuilderWorkspace
                    filters={filters}
                    onChangeFilters={onChangeFilters}
                    totalNumberOfCalls={totalHits}
                  />

                  <MaxWidthFullscreenContainer>
                    <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
                  </MaxWidthFullscreenContainer>
                  {activeDialog && <DisabledBodyScroll />}
                </Fragment>
              </Sticky>
            );
          }}
        />
      </Switch>
    </Fragment>
  );
}

function AnalyzeHeader() {
  return (
    <div className={locals.headerWrapper}>
      <MaxWidthFullscreenContainer>
        <div className={locals.header}>
          <SvgIcon className={locals.icon} type="lib_analyze" width={32} height={32} />
          Calls
        </div>
      </MaxWidthFullscreenContainer>
    </div>
  );
}
