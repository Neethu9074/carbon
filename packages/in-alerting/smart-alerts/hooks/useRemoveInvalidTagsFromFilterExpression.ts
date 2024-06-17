/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { countTagFilters } from 'in-alerting/smart-alerts/components/utils/countTagFilters';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { GetTagCatalog } from 'in-components/QueryBuilder';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Result } from 'in-types';

export function useRemoveInvalidTagsFromFilterExpression(
  getTagCatalog: GetTagCatalog,
  tagFilterExpression: FormModelElement[],
  updateTagFilterExpression: (updatedExpression: FormModelElement[]) => void
) {
  const timeConfig = useTimeConfig();

  // in the background, this will automatically handle the "race-condition", when getTagCatalog was
  // changed more than once while still loading, and it will automatically safely only
  // return the last completely-loaded tag catalog which will always fit to the specified getTagCatalog/alertType
  const tagCatalogResult: Result<EnrichedTagCatalog> | undefined | null = useObservable(
    () => getTagCatalog({ timeConfig }),
    [getTagCatalog, timeConfig]
  );
  const availableTagFilters = tagCatalogResult?.data?.allTagNames;

  // Optimisation: Do this filtering only when tag catalog was changed
  useEffect(() => {
    if (availableTagFilters && tagFilterExpression) {
      try {
        removeInvalidFilters(tagFilterExpression, availableTagFilters, updateTagFilterExpression);
      } catch (ignoreParsingError) {
        // An invalid tag expression can not be converted to the backend model.
        // Then we won't be able to remove invalid tags.
      }
    }
    // only trigger on a changed tag filter list:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTagFilters]);
}

export function removeInvalidFilters(
  tagFilterExpression: FormModelElement[],
  availableTagFilters: string[],
  updateTagFilterExpression: (updatedExpression: FormModelElement[]) => void
) {
  const backendModel = toBackendQueryModel(tagFilterExpression);
  const previousCount = countTagFilters(backendModel);

  const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);
  const cleanedUpCount = countTagFilters(cleanedUpExpression);

  if (cleanedUpCount !== previousCount) {
    const filteredTagFilterExpression = fromBackendModel(cleanedUpExpression);

    updateTagFilterExpression(filteredTagFilterExpression);
  }
  return;
}
