/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { InfrastructureExploreItem, PaginatedResult, Result, TagFilterExpression, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import { error, hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

type getCollectorsProps = {
  retrievalSize?: number;
  query?: string;
};

export const useCollectors = ({
  retrievalSize = 10,
  query = ''
}: getCollectorsProps): Result<PaginatedResult<InfrastructureExploreItem>> => {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(
      getCollectors({
        timeConfig,
        retrievalSize,
        query
      }),
      [generateStableHash(timeConfig), generateStableHash(retrievalSize), generateStableHash(query)]
    ) ?? (pendingResult as Result<PaginatedResult<InfrastructureExploreItem>>);

  if (isLoading(result)) return pendingResult as Result<PaginatedResult<InfrastructureExploreItem>>;
  if (hasError(result)) return error<PaginatedResult<InfrastructureExploreItem>>(result.errors);

  const collectors = result.data?.items as unknown as InfrastructureExploreItem[];
  return {
    ...result,
    data: {
      ...result.data!,
      items: collectors
    }
  };
};

export const getCollectors = ({
  timeConfig,
  retrievalSize = 10,
  query
}: getCollectorsProps & { timeConfig: TimeConfig }) => {
  const tagFilterExpression: TagFilterExpression = {
    logicalOperator: 'AND',
    type: 'EXPRESSION',
    elements: [
      {
        name: 'otel.attribute.entity.type',
        operator: 'EQUALS',
        value: 'otel-collector',
        type: 'TAG_FILTER',
        entity: NOT_APPLICABLE
      }
    ]
  };

  if (query) {
    tagFilterExpression.elements.push({
      name: 'otel.attribute.service.instance.id',
      operator: 'CONTAINS',
      value: query,
      type: 'TAG_FILTER',
      entity: NOT_APPLICABLE
    });
  }

  return getEntities({
    filter: {
      tagFilterExpression,
      timeConfig
    },
    order: { by: 'id', direction: 'ASC' },
    type: 'openTelemetry',
    pagination: { retrievalSize }
  });
};
