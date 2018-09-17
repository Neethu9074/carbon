import { compose, defaultProps } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString,
  getShowRawFromUrlString
} from 'in-analyze/filterBuilder';
import {
  showRawData as showRawDataMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QueryBuilderWorkspace from 'in-analyze/Analyze/components/QueryBuilderWorkspace';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import RawDataView from 'in-analyze/Analyze/components/RawDataView/RawDataView';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './CallsList.mless';

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
    boundKeys: [tagFilterMatrixParameter, groupByMatrixParameter, showRawDataMatrixParameter],
    getResettingProps: () => [],
    getInitialState: () => {
      const initialState = {};
      initialState[tagFilterMatrixParameter] = [];
      return initialState;
    },
    reducerName: 'onChangeFilters',
    getParsedUrlValues: values => {
      const urlFilters = values[tagFilterMatrixParameter];
      const tagFilter = getTagFilterFromUrlString(urlFilters);

      const urlGroup = values[groupByMatrixParameter];
      const group = getGroupFromUrlString(urlGroup);

      const objectToReturn = {};
      objectToReturn[tagFilterMatrixParameter] = tagFilter;
      objectToReturn[groupByMatrixParameter] = group;
      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const group = props[groupByMatrixParameter];
      const urlReadyGroup = getGroupToUrlString(group);

      const objectToStore = {};
      objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
      objectToStore[groupByMatrixParameter] = urlReadyGroup;
      return objectToStore;
    }
  })
)(CallsList);

function CallsList(props) {
  const { activeDialog, onChangeFilters, location, totalHits } = props;
  const tagFilter = props[tagFilterMatrixParameter];

  let filters = fromJS({
    tagFilter,
    group: props[groupByMatrixParameter] || { name: 'endpoint.name', value: '' }
  });
  filters = filters.set('timeConfig', getTimeConfig(location));
  const rawDataGroup = getShowRawFromUrlString(getMatrixParameter(location, analyze, showRawDataMatrixParameter));

  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(filters.get('tagFilter').toJS());

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
                filterByGroup={rawDataGroup}
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
