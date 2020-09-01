import getTagCatalog from 'in-infrastructure/subscriptions/getTagCatalog';
import getTagValueSearchSuggestions from 'in-infrastructure/subscriptions/getTagValueSuggestions';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: searchContext => {
    return getTagValueSearchSuggestions({
      tagName: searchContext.name,
      timeConfig: searchContext.timeConfig,
      partialTagValue: searchContext.value,
      valueCount: 10
    });
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
