/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose, key, value } = params;
    return getTagSuggestions({
      timeConfig,
      tagName,
      key,
      value,
      propose,
      logicalOperator: 'AND',
      logTagFilterExpression: tagFilterExpression,
      infraTagFilterExpression: emptyTagFilterExpression
    });
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
