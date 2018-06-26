import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  applicationFilter as applicationFilterMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import {
  getApplicationFilterToURLString,
  getTagFilterToURLString,
  getApplicationFilter,
  getTagFilter
} from 'in-analyze/CallsList/filterBuilder';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getGroupByTechnicalName } from 'in-analyze/CallsList/groups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/CallsList/AnalyzeHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import RawCalls from 'in-analyze/RawCalls';
import Title from 'in-components/Title';

import locals from './CallsList.mless';

export default withUrlDependingState({
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
    const tagFilter = getTagFilter(urlFilters);

    const urlGroup = values[groupByMatrixParameter];
    const group = getGroupByTechnicalName(urlGroup);

    const urlApplicationFilters = values[applicationFilterMatrixParameter];
    const applicationFilter = getApplicationFilter(urlApplicationFilters);

    const objectToReturn = {};
    objectToReturn[applicationFilterMatrixParameter] = applicationFilter;
    objectToReturn[tagFilterMatrixParameter] = tagFilter;
    objectToReturn[groupByMatrixParameter] = group;
    return objectToReturn;
  },
  getSerializedUrlValues: props => {
    let group = props[groupByMatrixParameter];
    group = group ? group.technicalName : null;

    const tagFilter = props[tagFilterMatrixParameter];
    const urlReadyTagFilter = getTagFilterToURLString(tagFilter);

    const applicationFilter = props[applicationFilterMatrixParameter];
    const urlReadyApplicationFilter = getApplicationFilterToURLString(applicationFilter);

    const objectToStore = {};
    objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
    objectToStore[applicationFilterMatrixParameter] = urlReadyApplicationFilter;
    objectToStore[groupByMatrixParameter] = group;
    return objectToStore;
  }
})(CallList);

function CallList(props) {
  const { onChangeFilters, location } = props;

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
      <AnalyzeHeader filters={filters} onChangeFilters={onChangeFilters} />
      <MaxWidthFullscreenContainer className={locals.callsList}>
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
  const type = node ? node.type : 'STRING';
  if (type === 'NUMBER') {
    backendTagFilter.numberValue = tag.value;
  } else if (type === 'BOOLEAN') {
    backendTagFilter.booleanValue = tag.value;
  } else {
    backendTagFilter.stringValue = tag.value;
  }
}
