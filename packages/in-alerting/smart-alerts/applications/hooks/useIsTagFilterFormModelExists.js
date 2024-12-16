/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useIsTagFilterFormModelExists(tagFilterExpression, getTagCatalog, updateTagFilterExpression) {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);

  const availableTagFilters = tagCatalogResult?.data?.allTagNames ?? [];
  useEffect(() => {
    if (!tagCatalogResult || tagCatalogResult.progress?.loading) return;
    if (availableTagFilters && tagFilterExpression) {
      try {
        return removeInvalidFilters(tagFilterExpression, availableTagFilters, updateTagFilterExpression);
      } catch (ignoreParsingError) {
        // An invalid tag expression can not be converted to the backend model.
        // Then we won't be able to remove invalid tags.
      }
    }
    // only trigger on a changed tag filter list:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTagFilters]);
}

function removeInvalidFilters(tagFilterExpression, availableTagFilters, updateTagFilterExpression) {
  const backendModel = toBackendQueryModel(tagFilterExpression);

  const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);

  const filteredTagFilterExpression = fromBackendModel(cleanedUpExpression);

  updateTagFilterExpression(filteredTagFilterExpression);

  return;
}

function removeExcludedFilters(tagFilterExpression, availableTagFilters) {
  // only one tagFilter, resetting UI Model needs to be done from the outside so we return null
  if (tagFilterExpression.type === 'TAG_FILTER' && !availableTagFilters.includes(tagFilterExpression.name)) {
    return { ...tagFilterExpression, tagDefinition: undefined };
  }

  let { elements = [] } = tagFilterExpression;

  if (tagFilterExpression.type === 'EXPRESSION' && elements.length === 0) {
    return tagFilterExpression;
  }

  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];

    if (element.type === 'EXPRESSION') {
      removeExcludedFilters(element, availableTagFilters);
    }

    if (element.type === 'TAG_FILTER' && !availableTagFilters.includes(element.name)) {
      elements[i] = { ...elements[i], tagDefinition: undefined };
    }
  }

  tagFilterExpression.elements = elements;

  return tagFilterExpression;
}
