import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: getApplicationTagCatalog,
  getSuggestions: args =>
    getTagSuggestions({
      ...args,
      filter: {
        timeConfig: args.timeConfig
      }
    })
});

export default QueryBuilder;

export const isCallQueryValid = isQueryValidInternal;
