/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error module needs to be translated to TS
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTestTagSuggestions from 'in-synthetics/subscriptions/getTestTagSuggestions';
import { getSyntheticTagCatalog } from 'in-synthetics/api';
import { TimeConfig } from 'in-types';

const { getTagCatalog: getTagCatalogInternal, GroupingConfigurator } = createGroupingConfigurator({
  getTagCatalog: (props: { timeConfig: TimeConfig }) =>
    getSyntheticTagCatalog({ dataSource: 'SYNTHETICS', useCase: 'GROUPING' })(props),
  getSuggestions: (args: any) => {
    return getTestTagSuggestions({
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
