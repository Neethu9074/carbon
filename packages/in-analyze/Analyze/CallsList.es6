import { defaultProps, compose } from 'recompose';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import {
  getTagFilterToUrlString,
  getGroupToUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString
} from 'in-analyze/filterBuilder';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/Analyze/AnalyzeHeader';
import getCalls from 'in-subscription/application/getCalls';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import cursorPaginated from 'in-hoc/cursorPaginated';
import GroupedCalls from 'in-analyze/GroupedCalls';
import RawCalls from 'in-analyze/RawCalls';
import Title from 'in-components/Title';

export default compose(
  defaultProps({
    repalceHistory: false
  }),
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => '',
    boundKeys: [tagFilterMatrixParameter, groupByMatrixParameter],
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
  }),
  cursorPaginated({
    getResettingProps: () => ['location'],
    get: ({ location }) =>
      getCalls({
        pagination: {
          cursor: null,
          retrievalSize: 1
        },
        order: {
          by: 't',
          direction: 'ASC'
        },
        filter: {
          timeConfig: getTimeConfig(location)
        },
        tagFilters: []
      })
  })
)(CallList);

function CallList(props) {
  const { onChangeFilters, location, totalHits } = props;

  let filters = fromJS({
    tagFilter: props[tagFilterMatrixParameter],
    group: props[groupByMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const tagFiltersForSubscription = getTagFilterList(filters);

  return (
    <Fragment>
      <Title title="Calls" />
      <AnalyzeHeader filters={filters} onChangeFilters={onChangeFilters} totalNumberOfCalls={totalHits} />
      <MaxWidthFullscreenContainer>
        {filters.get('group') && (
          <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
        )}
        {!filters.get('group') && (
          <RawCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
        )}
      </MaxWidthFullscreenContainer>
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
    backendTagFilter.stringValue = tag.value;
  }
}
