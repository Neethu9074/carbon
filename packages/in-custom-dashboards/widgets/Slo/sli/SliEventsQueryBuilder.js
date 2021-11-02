/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { getApplicationIdTagFilter } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { CALLS } from 'in-applications/analyze/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function useApplicationQueryBuilder({ applicationId, boundaryScope } = {}) {
  return useMemo(
    () =>
      createQueryBuilder({
        maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
        getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SLI_MANAGEMENT' })(props),
        getSuggestions: args => {
          return getTagSuggestions({
            entity: args.entity,
            propose: args.propose,
            tagFilterExpression: addTagFilters(args.tagFilterExpression, [
              getApplicationIdTagFilter(boundaryScope, applicationId)
            ]),
            tagName: args.name,
            value: args.value,
            filter: {
              timeConfig: args.timeConfig
            },
            secondLevelKeyTagName: args.key
          });
        }
      }),
    [applicationId, boundaryScope]
  );
}

export function useValidateApplicationFilterExpression({ isQueryValid, filterExpression }) {
  const timeConfig = useTimeConfig();
  return !!useObservable(
    () => (filterExpression?.length ? isQueryValid(filterExpression, timeConfig) : just({ data: true })),
    [filterExpression, timeConfig]
  )?.data;
}
