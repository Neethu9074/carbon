/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { CALLS } from 'in-applications/analyze/metrics';

const {
  getTagCatalog: getTagCatalogInternal,
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'GROUPING' })(props),
  getSuggestions: args => {
    return getTagSuggestions({
      entity: args.entity,
      propose: args.propose,
      tagFilterExpression: args.tagFilterExpression,
      tagName: args.name,
      value: args.value,
      filter: {
        timeConfig: args.timeConfig
      }
    });
  }
});

export default GroupingConfigurator;

export const getGroupingTagCatalog = getTagCatalogInternal;

export const isCallGroupingConfigurationValid = params => isGroupingConfigurationValidInternal(...params);
