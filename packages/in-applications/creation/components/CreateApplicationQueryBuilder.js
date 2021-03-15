/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { QueryBuilder, isQueryValid: isQueryValidInternal, getTagCatalog: getTagCatalogInternal } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'APPLICATION_CONFIG' })(props),
  getSuggestions: args =>
    getTagSuggestions({
      entity: args.entity,
      propose: args.propose,
      tagFilterExpression: args.tagFilterExpression,
      tagName: args.name,
      value: args.value,
      filter: {
        timeConfig: args.timeConfig
      },
      secondLevelKeyTagName: args.key
    })
});

export default QueryBuilder;

export const getTagCatalog = getTagCatalogInternal;

export const isQueryValid = ([tagFilterExpression, timeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);
