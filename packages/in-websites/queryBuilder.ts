/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  CursorPaginatedResult,
  DataSource,
  Result,
  TagFilterExpressionElementUnion,
  TagSuggestionProposeType,
  TimeConfig,
  WebsiteBeaconGroupsItem
} from 'in-types';
import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

export const pageLoad = create('pageLoad');
export const pageChange = create('pageChange');
export const resourceLoad = create('resourceLoad');
export const httpRequest = create('httpRequest');
export const error = create('error');
export const custom = create('custom');

function create(beaconType: string): CreateQueryBuilderResponse {
  return createQueryBuilder({
    maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'FILTERING' }),
    getSuggestions: args => getSuggestions({ ...args, beaconType })
  });
}

export interface Suggestions {
  suggestions: string[];
  totalHits: number;
}

export interface GetSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  propose?: TagSuggestionProposeType;
  tagFilterExpression?: TagFilterExpressionElementUnion;
  dataSource?: DataSource;
  beaconType?: string;
}

export function getSuggestions({
  name,
  key,
  timeConfig,
  propose,
  tagFilterExpression: tfe,
  beaconType,
  dataSource
}: GetSuggestionsProps): Observable<Result<Suggestions>> {
  // Add beacon type to avoid presenting suggestions for other data sources
  const tagFilterExpression = addTagFilters(tfe, [
    tagFilter('beacon.type', 'EQUALS', beaconType || dataSource) // We support dataSource for compatibility with the analyze wrapper
  ]);

  const subscriptionParams = {
    timeConfig,
    tagFilterExpression,
    metrics: {
      beaconCount: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      } as const
    },
    order: {
      by: 'beaconCount',
      direction: 'DESC'
    } as const,
    pagination: {
      retrievalSize: 200
    },
    group: {
      groupbyTag: name,
      // Note: We currently do not support suggestions based on partial key/value input
      groupbyTagSecondLevelKey: propose === 'VALUES' ? key : undefined
    },
    includeOthers: false
  };

  return getWebsiteBeaconGroups(subscriptionParams).map(retainGroupNames);
}

function retainGroupNames(result: Result<CursorPaginatedResult<WebsiteBeaconGroupsItem>>): Result<Suggestions> {
  if (!result.data) {
    return (result as unknown) as Result<Suggestions>;
  }

  return {
    ...result,
    data: {
      suggestions: result.data.items.map(item => JSON.parse(item.name)),
      totalHits: result.data.totalHits
    }
  };
}
