/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { getMatrixParameter, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { CONJUNCTION, enclose } from 'in-components/QueryBuilder/transformation/formModel';
import { analyzePath, analyzeTwoParameters } from 'in-applications/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';

export const TAG_SERVICE_NAME = 'service.name';
export const TAG_SERVICE_ID = 'service.id';
export const TAG_ENDPOINT_NAME = 'endpoint.name';
export const TAG_ENDPOINT_ID = 'endpoint.id';

export function isAnalyticsWithHiddenTagsLocation(location, tagCatalog) {
  return (
    tagCatalog &&
    getFormModel(location).some(
      tagFilter =>
        (tagFilter.name === TAG_SERVICE_ID &&
          tagFilter.value != null &&
          tagFilter.operator === EQUALS &&
          isHidden(TAG_SERVICE_ID, tagCatalog)) ||
        (tagFilter.name === TAG_ENDPOINT_ID &&
          tagFilter.value != null &&
          tagFilter.operator === EQUALS &&
          isHidden(TAG_ENDPOINT_ID, tagCatalog))
    )
  );
}

/**
 * Checks whether the tag-filters in the URL might have been converted already, in case service.name or endpoint.name with EQUALS
 * matching are already present.
 */
export function alreadyConvertedAnalyticsWithHiddenTagsLocation(location) {
  // This check has the known drawback that in case a user manually provides a service.name or endpoint.name tag already,
  // then no conversion is applied.
  return getFormModel(location).some(
    tagFilter =>
      (tagFilter.name === TAG_SERVICE_NAME && tagFilter.value != null && tagFilter.operator === EQUALS) ||
      (tagFilter.name === TAG_ENDPOINT_NAME && tagFilter.value != null && tagFilter.operator === EQUALS)
  );
}

export function getServiceIds(location) {
  return getTagValues(location, TAG_SERVICE_ID);
}

export function getEndpointIds(location) {
  return getTagValues(location, TAG_ENDPOINT_ID);
}

function getTagValues(location, tagName) {
  const values = getFormModel(location)
    .filter(t => t.name === tagName)
    .map(t => t.value)
    .filter(Boolean);
  return [...new Set(values)];
}

export function transformHiddenTags({ location, serviceResults, endpointResults }) {
  const formModel = getFormModel(location);
  const updatedModel = [];

  formModel.forEach(tagFilter => {
    if (tagFilter.name === TAG_SERVICE_ID && tagFilter.value != null && tagFilter.operator === EQUALS) {
      transformServiceIdFilter(updatedModel, tagFilter, serviceResults);
    } else if (tagFilter.name === TAG_ENDPOINT_ID && tagFilter.value != null && tagFilter.operator === EQUALS) {
      transformEndpointIdFilter(updatedModel, tagFilter, endpointResults);
    } else {
      updatedModel.push(tagFilter);
    }
  });

  setOrDeleteMatrixParameter(location, analyzeTwoParameters.tagFilterExpression, updatedModel);
}

function transformServiceIdFilter(updatedModel, tagFilter, serviceResults) {
  const serviceInfo = findById(serviceResults, tagFilter.value);
  if (serviceInfo == null) {
    updatedModel.push(tagFilter);
    return;
  }
  updatedModel.push(
    ...enclose([
      { ...tagFilter, name: TAG_SERVICE_NAME, value: serviceInfo.label },
      { type: CONJUNCTION, logicalOperator: and },
      tagFilter
    ])
  );
}

function transformEndpointIdFilter(updatedModel, tagFilter, endpointResults) {
  const endpointInfo = findById(endpointResults, tagFilter.value);
  if (endpointInfo == null) {
    updatedModel.push(tagFilter);
    return;
  }
  updatedModel.push(
    ...enclose([
      { ...tagFilter, name: TAG_ENDPOINT_NAME, value: endpointInfo.label },
      { type: CONJUNCTION, logicalOperator: and },
      tagFilter
    ])
  );
}

function findById(results, id) {
  return results.map(res => res.data).find(data => data?.id === id);
}

function getFormModel(location) {
  const paramValue = getMatrixParameter(location, analyzePath, analyzeTwoParameters.tagFilterExpression.name);
  return analyzeTwoParameters.tagFilterExpression.parser(paramValue);
}

function isHidden(tagName, tagCatalog) {
  if (tagCatalog == null) {
    // consider as hidden if the catalog is not loaded yet
    return true;
  }
  tagCatalog = enrichTagCatalog(tagCatalog);
  const tagDefinition = tagCatalog.tagsByName[tagName];
  if (tagDefinition == null) {
    // consider as hidden if not available in the catalog
    return true;
  }
  // visible by default
  return tagDefinition.path[tagDefinition.path.length - 1].hidden ?? false;
}
