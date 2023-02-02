/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createDynamicQueryBuilder({
  getSuggestions: getTagValueSuggestions
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
