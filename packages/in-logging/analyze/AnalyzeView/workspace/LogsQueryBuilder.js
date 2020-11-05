import getTagValueSearchSuggestions from 'in-logging/subscriptions/getTagValueSuggestions';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: ({ name, timeConfig, value }) => {
    return getTagValueSearchSuggestions({
      timeConfig,
      tagName: name,
      partialTagValue: value,
      valueCount: 10
    });
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
