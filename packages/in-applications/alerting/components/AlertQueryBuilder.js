import filteredTree from 'in-applications/analyze/components/workspace/TagCatalogFilteredTree';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';

// TODO: this component is copy pasted form the CallQueryBuilder.js component.
// We need to change/adjust this later when smart alerts tagCatalogues are ready to use.

const { QueryBuilder: AlertQueryBuilder, isQueryValid } = createQueryBuilder({
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

export default AlertQueryBuilder;

export const isAlertQueryValid = ([tagFilterExpression, timeConfig]) => isQueryValid(tagFilterExpression, timeConfig);
