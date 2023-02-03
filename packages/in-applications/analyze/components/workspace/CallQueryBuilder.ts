/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { TimeConfig, TagFilterExpressionElementUnion } from 'in-types';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

interface AdditionalTagSuggestionProps {
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
}

const { QueryBuilder, isQueryValid: isQueryValidInternal, getTagCatalog: getTagCatalogInternal } = createQueryBuilder<
  AdditionalTagSuggestionProps
>({
  maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'FILTERING' })(props),
  getSuggestions: args => {
    return isIdTag(args.name) || (args.propose === 'VALUES' && args.key === '')
      ? null
      : getTagSuggestions({
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

export const isCallQueryValid = ([tagFilterExpression, timeConfig]: [TagFilterExpressionElementUnion, TimeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);

export const isIdTag = (tagName: string) => tagName.endsWith('id') || tagName.endsWith('snapshotId');
