import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: getApplicationTagCatalog,
  getSuggestions: ({ name, key, value, timeConfig, entity, tagFilterExpression, propose }) => {
    return getTagSuggestions({
      entity: entity,
      propose: propose,
      tagFilterExpression: tagFilterExpression,
      tagName: name,
      value: value,
      filter: {
        timeConfig: timeConfig
      },
      secondLevelKeyTagName: key
    });
  }
});

export default QueryBuilder;

export const isCallQueryValid = isQueryValidInternal;
