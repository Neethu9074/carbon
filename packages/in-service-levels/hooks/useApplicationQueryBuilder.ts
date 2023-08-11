/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useMemo } from 'react';

import {
  BoundaryScope,
  Result,
  TagFilter,
  TagFilterEntity,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';
import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { boundaryScopes } from 'in-applications/constants';
import { CALLS } from 'in-applications/analyze/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';

export interface UseApplicationQueryBuilderProps {
  applicationId?: string;
  boundaryScope?: BoundaryScope;
}

export function useApplicationQueryBuilder({
  applicationId,
  boundaryScope = 'DEFAULT'
}: UseApplicationQueryBuilderProps) {
  return useMemo(() => {
    const additionalTagFilters: TagFilterExpressionElementUnion[] = [];
    if (applicationId) {
      additionalTagFilters.push(getApplicationIdTagFilter(boundaryScope, applicationId));
    }
    return createQueryBuilder({
      maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
      getTagCatalog: props => getApplicationTagCatalog({ dataSource: CALLS, useCase: 'SLI_MANAGEMENT' })(props),
      getSuggestions: args => {
        return getTagSuggestions({
          entity: args.entity,
          tagFilterExpression: addTagFilters(args.tagFilterExpression, additionalTagFilters),
          tagName: args.name,
          filter: {
            timeConfig: args.timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          secondLevelKeyTagName: args.key,
          requestingSecondaryKeySuggestions: false
        });
      }
    });
  }, [applicationId, boundaryScope]);
}

interface UseValidateApplicationFilterExpressionProps {
  filterExpression?: FormModelElement[];
  isQueryValid: (filterExpression: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<boolean>>;
}

export function useValidateApplicationFilterExpression({
  isQueryValid,
  filterExpression
}: UseValidateApplicationFilterExpressionProps): boolean {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () => (filterExpression?.length ? isQueryValid(filterExpression, timeConfig) : just(success(true))),
      [filterExpression, timeConfig]
    )?.data ?? false
  );
}

function getApplicationIdTagFilter(boundaryScope: BoundaryScope, applicationId: string): TagFilter {
  return tagFilter(
    boundaryScope === boundaryScopes.inbound ? 'boundary.application.id' : 'application.id',
    EQUALS,
    applicationId,
    null,
    tagFilterEntity(boundaryScope)
  );
}

function tagFilterEntity(boundaryScope: BoundaryScope): TagFilterEntity {
  return boundaryScope === boundaryScopes.inbound ? NOT_APPLICABLE : DESTINATION;
}
