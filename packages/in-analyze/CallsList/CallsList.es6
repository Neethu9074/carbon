import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import {
  applicationFilter as applicationFilterMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getApplicationFilterToUrlString,
  getTagFilterToUrlString,
  getGroupToUrlString,
  getApplicationFilterFromUrlString,
  getTagFilterFromUrlString,
  getGroupFromUrlString
} from 'in-analyze/CallsList/filterBuilder';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { TAG_TYPES, APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/CallsList/AnalyzeHeader';
import getCalls from 'in-subscription/application/getCalls';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import RawCalls from 'in-analyze/RawCalls';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => '',
    boundKeys: [applicationFilterMatrixParameter, tagFilterMatrixParameter, groupByMatrixParameter],
    getResettingProps: () => [],
    getInitialState: () => {
      const initialState = {};
      initialState[tagFilterMatrixParameter] = [];
      initialState[applicationFilterMatrixParameter] = {};
      return initialState;
    },
    reducerName: 'onChangeFilters',
    getParsedUrlValues: values => {
      const urlFilters = values[tagFilterMatrixParameter];
      const tagFilter = getTagFilterFromUrlString(urlFilters);

      const urlGroup = values[groupByMatrixParameter];
      const group = getGroupFromUrlString(urlGroup);

      const urlApplicationFilters = values[applicationFilterMatrixParameter];
      const applicationFilter = getApplicationFilterFromUrlString(urlApplicationFilters);

      const objectToReturn = {};
      objectToReturn[applicationFilterMatrixParameter] = applicationFilter;
      objectToReturn[tagFilterMatrixParameter] = tagFilter;
      objectToReturn[groupByMatrixParameter] = group;
      return objectToReturn;
    },
    getSerializedUrlValues: props => {
      const tagFilter = props[tagFilterMatrixParameter];
      const urlReadyTagFilter = getTagFilterToUrlString(tagFilter);

      const group = props[groupByMatrixParameter];
      const urlReadyGroup = getGroupToUrlString(group);

      const applicationFilter = props[applicationFilterMatrixParameter];
      const urlReadyApplicationFilter = getApplicationFilterToUrlString(applicationFilter);

      const objectToStore = {};
      objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
      objectToStore[applicationFilterMatrixParameter] = urlReadyApplicationFilter;
      objectToStore[groupByMatrixParameter] = urlReadyGroup;
      return objectToStore;
    }
  }),
  connect(props => ({
    totalNumberOfCalls: getCalls({
      pagination: {
        cursor: null,
        retrievalSize: 1
      },
      order: {
        by: 't',
        direction: 'ASC'
      },
      filter: {
        timeConfig: getTimeConfig(props.location)
      },
      tagFilters: []
    }).map(result => get(result, ['data', 'totalHits'], null))
  }))
)(CallList);

function CallList(props) {
  const { onChangeFilters, location, totalNumberOfCalls } = props;

  const tagFilter = props[tagFilterMatrixParameter];
  const applicationFilter = props[applicationFilterMatrixParameter];

  let filters = fromJS({
    tagFilter,
    applicationFilter,
    group: props[groupByMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const tagFiltersForSubscription = getTagFilterList(filters);

  return (
    <Fragment>
      <Title title="Calls" />
      <AnalyzeHeader filters={filters} onChangeFilters={onChangeFilters} totalNumberOfCalls={totalNumberOfCalls} />
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
      const backendTagFilter = { name: tag.name };
      getValueByTag(backendTagFilter, tag);
      return backendTagFilter;
    });

  const application = filters.getIn(['applicationFilter', APPLICATION.id]);
  const service = filters.getIn(['applicationFilter', SERVICE.id]);
  const endpoint = filters.getIn(['applicationFilter', ENDPOINT.id]);
  if (application) {
    tagFilters.push({ name: APPLICATION.technicalName, stringValue: application.get('value') });
  }
  if (service) {
    tagFilters.push({ name: SERVICE.technicalName, stringValue: service.get('value') });
  }
  if (endpoint) {
    tagFilters.push({ name: ENDPOINT.technicalName, stringValue: endpoint.get('value') });
  }

  return tagFilters;
}

function getValueByTag(backendTagFilter, tag) {
  const node = findSubTreeByFullyQualifiedName(backendTagFilter.name);
  const type = node ? node.type : TAG_TYPES.STRING;
  if (type === TAG_TYPES.NUMBER) {
    backendTagFilter.numberValue = tag.value;
  } else if (type === TAG_TYPES.BOOLEAN) {
    backendTagFilter.booleanValue = tag.value;
  } else {
    backendTagFilter.stringValue = tag.value;
  }
}
