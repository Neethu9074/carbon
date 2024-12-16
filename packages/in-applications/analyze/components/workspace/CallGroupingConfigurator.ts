/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { AdditionalTagSuggestionProps } from 'in-applications/types';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';

const { GroupingConfigurator } = createGroupingConfigurator<AdditionalTagSuggestionProps>({
  getTagCatalog: ({ timeConfig }: { timeConfig: TimeConfig }) =>
    getApplicationTagCatalog({ dataSource: CALLS, useCase: 'GROUPING' })({ timeConfig }),
  getSuggestions: (args: GetTagSuggestionsProps<AdditionalTagSuggestionProps>) => {
    return getTagSuggestions({
      entity: args.entity,
      tagFilterExpression: args.tagFilterExpression,
      tagName: args.name,
      filter: {
        timeConfig: args.timeConfig,
        includeInternalCalls: args.includeInternal,
        includeSyntheticCalls: args.includeSynthetic,
        useLongTermDataOnly: false
      },
      requestingSecondaryKeySuggestions: false
    });
  }
});

export default GroupingConfigurator;
