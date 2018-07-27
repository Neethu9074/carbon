import { Route, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { fromJS } from 'immutable';

import {
  showRawData as showRawDataMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString,
  getShowRawFromUrlString,
  getShowRawToUrlString
} from 'in-analyze/filterBuilder';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QueryBuilderWorkspace from 'in-analyze/Analyze/components/QueryBuilderWorkspace';
import RawDataView from 'in-analyze/Analyze/components/RawDataView/RawDataView';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import Title from 'in-components/Title';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => '',
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

      const urlShowRawActive = values[showRawDataMatrixParameter];
      const showRawActive = getShowRawFromUrlString(urlShowRawActive);

      const objectToReturn = {};
      objectToReturn[tagFilterMatrixParameter] = tagFilter;
      objectToReturn[groupByMatrixParameter] = group;
      objectToReturn[showRawDataMatrixParameter] = showRawActive;
      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const group = props[groupByMatrixParameter];
      const urlReadyGroup = getGroupToUrlString(group);

      const showRawActive = props[showRawDataMatrixParameter];
      const urlReadyShowRawActive = getShowRawToUrlString(showRawActive);

      const objectToStore = {};
      objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
      objectToStore[groupByMatrixParameter] = urlReadyGroup;
      objectToStore[showRawDataMatrixParameter] = urlReadyShowRawActive;
      return objectToStore;
    }
  })
)(CallsList);

function CallsList(props) {
  const { onChangeFilters, location, totalHits } = props;
  const tagFilter = props[tagFilterMatrixParameter];

  let filters = fromJS({
    tagFilter,
    group: props[groupByMatrixParameter] || { name: 'call.name', value: '' }
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const tagFiltersForSubscription = getTagFilterList(filters);

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
              <Fragment>
                <QueryBuilderWorkspace
                  filters={filters}
                  onChangeFilters={onChangeFilters}
                  totalNumberOfCalls={totalHits}
                />

                <MaxWidthFullscreenContainer>
                  <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
                </MaxWidthFullscreenContainer>
              </Fragment>
            );
          }}
        />
      </Switch>
    </Fragment>
  );
}

function getTagFilterList(filters) {
  const tagFilters = filters
    .get('tagFilter')
    .toJS()
    .map(tag => {
      const backendTagFilter = { name: tag.name, operator: tag.operator };
      getValueByTag(backendTagFilter, tag);
      return backendTagFilter;
    });

  return tagFilters;
}

function getValueByTag(backendTagFilter, tag) {
  const node = findSubTreeByFullyQualifiedName(backendTagFilter.name);
  const type = node ? node.type : TAG_TYPES.STRING.technicalName;

  if (type === TAG_TYPES.NUMBER.technicalName) {
    backendTagFilter.numberValue = tag.value;
  } else if (type === TAG_TYPES.BOOLEAN.technicalName) {
    backendTagFilter.booleanValue = tag.value;
  } else {
    backendTagFilter.stringValue = tag.secondLevelName ? `${tag.secondLevelName}=${tag.value}` : tag.value;
  }
}
