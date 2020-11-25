import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose, key, value } = params;
    return getTagSuggestions({
      tagFilterExpression,
      timeConfig,
      tagName,
      key,
      value,
      propose
    });
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
