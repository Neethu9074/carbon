/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import getSubtraceTagSuggestion from 'in-applications/subscriptions/getSubtraceTagSuggestion';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { AdditionalTagSuggestionProps } from 'in-applications/types';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { SUBTRACES } from 'in-applications/analyze/metrics';
import { TimeConfig } from 'in-types';

const {
  QueryBuilder,
  isQueryValid: isQueryValidInternal,
  getTagCatalog: getTagCatalogInternal
} = createQueryBuilder<AdditionalTagSuggestionProps>({
  maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: SUBTRACES, useCase: 'FILTERING' })(props),
  getSuggestions: args => {
    return isIdTag(args.name) || (args.propose === 'VALUES' && args.key === '')
      ? null
      : getSubtraceTagSuggestion({
          entity: args.entity,
          tagFilterExpression: args.tagFilterExpression,
          tagName: args.name,
          filter: {
            timeConfig: args.timeConfig,
            includeInternalCalls: args.includeInternal,
            includeSyntheticCalls: args.includeSynthetic,
            useLongTermDataOnly: false
          },
          secondLevelKeyTagName: args.propose === 'VALUES' ? args.key : undefined,
          includeInternal: args.includeInternal,
          includeSynthetic: args.includeSynthetic,
          requestingSecondaryKeySuggestions: false
        });
  }
});

export default QueryBuilder;

export const getTagCatalog = getTagCatalogInternal;

export const isCallQueryValid = ([tagFilterExpression, timeConfig]: [FormModelElement[], TimeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);

export const isIdTag = (tagName: string) => tagName.endsWith('id') || tagName.endsWith('snapshotId');
