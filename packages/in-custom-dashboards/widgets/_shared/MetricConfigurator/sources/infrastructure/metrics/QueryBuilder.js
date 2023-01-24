/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal, getTagCatalog: getTagCatalogInternal } = createQueryBuilder({
  getTagCatalog: props => getTagCatalogSubscription({ includeMetricTags: true, ...props }),
  getSuggestions: getTagValueSuggestions,
  withFullTimePrecision: true
});

export const getTagCatalog = getTagCatalogInternal;

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
