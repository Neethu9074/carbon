/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetUnifiedCatalogQuery } from '@instana/types';

// @ts-expect-error needs to be converted to typescript
import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import getUnifiedTagCatalog from 'in-custom-dashboards/components/getUnifiedTagCatalog';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createDynamicQueryBuilder<{}, {}>({
  getSuggestions: getTagValueSuggestions, // TODO: handle suggestions other than infra
  addTagDefinitionToFormModel: true,
  getTagCatalog: ({ timeConfig, query }) =>
    getUnifiedTagCatalog({ timeConfig, query, includeInternalTags: false } as GetUnifiedCatalogQuery)
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
