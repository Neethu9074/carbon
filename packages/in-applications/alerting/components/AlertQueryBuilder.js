/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { QueryBuilder: AlertQueryBuilder, isQueryValid } = createQueryBuilder({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SMART_ALERTS' })(props),
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
