/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { QueryBuilder, isQueryValid: isQueryValidInternal, getTagCatalog: getTagCatalogInternal } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'FILTERING' })(props),
  getSuggestions: args => {
    return isIdTag(args.name)
      ? null
      : getTagSuggestions({
          entity: args.entity,
          propose: args.propose,
          tagFilterExpression: args.tagFilterExpression,
          tagName: args.name,
          value: args.value,
          filter: {
            timeConfig: args.timeConfig
          },
          secondLevelKeyTagName: args.key,
          includeInternal: args.includeInternal,
          includeSynthetic: args.includeSynthetic
        });
  }
});

export default QueryBuilder;

export const getTagCatalog = getTagCatalogInternal;

export const isCallQueryValid = ([tagFilterExpression, timeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);

export const isIdTag = tagName => tagName.endsWith('id') || tagName.endsWith('snapshotId');
