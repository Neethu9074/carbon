/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetUnifiedCatalogQuery } from '@instana/types';

// @ts-expect-error needs to be converted to typescript
import getUnifiedTagValueSuggestions from 'in-infrastructure/Explore/services/getUnifiedTagValueSuggestions';
import getUnifiedTagCatalog from 'in-custom-dashboards/components/getUnifiedTagCatalog';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createDynamicQueryBuilder<{}, {}>({
  getSuggestions: getUnifiedTagValueSuggestions,
  addTagDefinitionToFormModel: true,
  getTagCatalog: ({ timeConfig, query }) =>
    getUnifiedTagCatalog({ timeConfig, query, includeInternalTags: false } as GetUnifiedCatalogQuery)
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
