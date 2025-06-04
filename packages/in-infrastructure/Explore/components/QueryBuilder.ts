/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs to be converted to typescript
import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalog from 'in-infrastructure/Explore/services/getTagCatalog';
import { serverSideInfraTagSearchEnabled } from 'in-services/featureFlags';
import { createDynamicQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createDynamicQueryBuilder<
  {},
  { ownerType?: string; metric?: string; regex: boolean }
>({
  getSuggestions: getTagValueSuggestions,
  getTagCatalog: serverSideInfraTagSearchEnabled
    ? ({ timeConfig, query, ownerType, metric, regex }) =>
        getTagCatalog({
          filter: { timeConfig, tagFilterExpression: EMPTY_EXPRESSION },
          ownerType,
          query,
          metric,
          regex,
          includeHidden: false
        })
    : undefined,
  addTagDefinitionToFormModel: true,
  disableEntitySelection: true
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
