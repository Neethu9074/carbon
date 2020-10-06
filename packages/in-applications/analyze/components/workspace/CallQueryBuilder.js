import filteredTree from 'in-applications/analyze/components/workspace/TagCatalogFilteredTree';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: 'CALLS' })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: filteredTree(response.data.tagTree, response.data.tags, true)
      }
    })),
  getSuggestions: args => {
    return getTagSuggestions({
      entity: args.entity,
      propose: args.propose,
      tagFilterExpression: args.tagFilterExpression,
      tagName: args.name,
      value: args.value,
      filter: {
        timeConfig: args.timeConfig
      },
      secondLevelKeyTagName: args.key
    });
  }
});

export default QueryBuilder;

export const isCallQueryValid = isQueryValidInternal;
