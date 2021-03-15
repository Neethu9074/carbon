/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { QueryBuilder: SliEventsQueryBuilder, isQueryValid, getTagCatalog } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SLI_MANAGEMENT' })(props),
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

export default SliEventsQueryBuilder;
export const isSliEventsQueryValid = ([tagFilterExpression, timeConfig]) =>
  isQueryValid(tagFilterExpression, timeConfig);

export const getSliEventTagCatalog = getTagCatalog;
