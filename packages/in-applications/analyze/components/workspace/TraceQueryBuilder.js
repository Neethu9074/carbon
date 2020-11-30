import { isIdTag } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { TRACES } from 'in-applications/analyze/metrics';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: props =>
    getApplicationTagCatalog({ dataSource: TRACES, useCase: 'FILTERING' })(props).map(response => ({
      ...response,
      data: response.data && {
        ...response.data,
        tagTree: response.data.tagTree
      }
    })),
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
          secondLevelKeyTagName: args.key
        });
  },
  withoutOrConjunction: true,
  withoutBrackets: true
});

export default QueryBuilder;

export const isTraceQueryValid = ([tagFilterExpression, timeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);
