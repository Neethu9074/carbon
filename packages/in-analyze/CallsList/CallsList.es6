import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  applicationId as applicationIdMatrixParameter,
  serviceId as serviceIdMatrixParameter,
  endpointId as endpointIdMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getApplicationFilter, getTagFilter } from 'in-analyze/CallsList/filterBuilder';
import { getGroupByTechnicalName } from 'in-analyze/CallsList/groups';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import AnalyzeHeader from 'in-analyze/CallsList/AnalyzeHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { analyze } from 'in-analyze/navigation/paths';
import GroupedCalls from 'in-analyze/GroupedCalls';
import RawCalls from 'in-analyze/RawCalls';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

import locals from './CallsList.mless';

export default withUrlDependingState({
  getPathSegment: () => analyze,
  getMatrixPrefix: () => '',
  boundKeys: [
    applicationIdMatrixParameter,
    serviceIdMatrixParameter,
    endpointIdMatrixParameter,
    tagFilterMatrixParameter,
    groupByMatrixParameter
  ],
  getResettingProps: () => [],
  getInitialState: () => {
    const initialState = {};
    initialState[tagFilterMatrixParameter] = [];
    return initialState;
  },
  reducerName: 'onChangeFilters',
  getParsedUrlValues: values => {
    const urlFilters = values[tagFilterMatrixParameter];
    const tagFilter = getTagFilter(urlFilters);

    const urlGroup = values[groupByMatrixParameter];
    const group = getGroupByTechnicalName(urlGroup);

    const objectToReturn = {};
    objectToReturn[tagFilterMatrixParameter] = tagFilter;
    objectToReturn[groupByMatrixParameter] = group;
    return objectToReturn;
  },
  getSerializedUrlValues: props => {
    let group = props[groupByMatrixParameter];
    group = group ? group.technicalName : null;

    const tagFilter = props[tagFilterMatrixParameter];
    const application = props[applicationIdMatrixParameter];
    const service = props[serviceIdMatrixParameter];
    const endpoint = props[endpointIdMatrixParameter];

    let urlReadyTagFilter = tagFilter.map(tag => ({ name: tag.name, value: tag.value }));
    if (urlReadyTagFilter.length === 0) {
      urlReadyTagFilter = null;
    } else {
      urlReadyTagFilter = JSON.stringify(urlReadyTagFilter);
    }

    const objectToStore = {};
    objectToStore[tagFilterMatrixParameter] = urlReadyTagFilter;
    objectToStore[groupByMatrixParameter] = group;
    objectToStore[applicationIdMatrixParameter] = application;
    objectToStore[serviceIdMatrixParameter] = service;
    objectToStore[endpointIdMatrixParameter] = endpoint;
    return objectToStore;
  }
})(CallList);

function CallList(props) {
  const { onChangeFilters, location } = props;

  let filters = fromJS({
    tagFilter: props[tagFilterMatrixParameter],
    applicationFilter: getApplicationFilter(
      props[applicationIdMatrixParameter],
      props[serviceIdMatrixParameter],
      props[endpointIdMatrixParameter]
    ),
    group: props[groupByMatrixParameter]
  });
  filters = filters.set('timeConfig', getTimeConfig(location));

  const tagFiltersForSubscription = getTagFilterList(filters);

  return (
    <Fragment>
      <Title title="Calls" />
      <Sticky header={<AnalyzeHeader filters={filters} onChangeFilters={onChangeFilters} />}>
        <MaxWidthFullscreenContainer className={locals.callsList}>
          {filters.get('group') && (
            <GroupedCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
          )}
          {!filters.get('group') && (
            <RawCalls {...props} filters={filters} tagFiltersForSubscription={tagFiltersForSubscription} />
          )}
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}

function getTagFilterList(filters) {
  const tagFilters = filters
    .get('tagFilter')
    .toJS()
    .map(tag => ({ name: tag.name, stringValue: tag.value }));

  const application = filters.getIn(['applicationFilter', applicationIdMatrixParameter]);
  const service = filters.getIn(['applicationFilter', serviceIdMatrixParameter]);
  const endpoint = filters.getIn(['applicationFilter', endpointIdMatrixParameter]);
  if (application) {
    tagFilters.push({ name: application.get('name'), stringValue: application.get('value') });
  }
  if (service) {
    tagFilters.push({ name: service.get('name'), stringValue: service.get('value') });
  }
  if (endpoint) {
    tagFilters.push({ name: endpoint.get('name'), stringValue: endpoint.get('value') });
  }

  return tagFilters;
}
