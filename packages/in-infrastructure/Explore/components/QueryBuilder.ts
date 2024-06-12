/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs to be converted to typescript
import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createDynamicQueryBuilder({
  getSuggestions: getTagValueSuggestions
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
