/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSearchSuggestions from 'in-infrastructure/subscriptions/getTagValueSuggestions';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal, getTagCatalog: getTagCatalogInternal } = createQueryBuilder({
  getTagCatalog: getTagCatalogSubscription,
  getSuggestions: searchContext => {
    return getTagValueSearchSuggestions({
      tagName: searchContext.name,
      timeConfig: searchContext.timeConfig,
      partialTagValue: searchContext.value,
      valueCount: 10
    });
  }
});

export const getTagCatalog = getTagCatalogInternal;

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
