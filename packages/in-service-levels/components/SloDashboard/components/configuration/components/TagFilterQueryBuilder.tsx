/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import type {
  ApplicationSloEntity,
  SloEntityUnion,
  TagFilterExpressionElementUnion,
  WebsiteSloEntity
} from '@instana/types';
import { isApplicationSloEntity, isWebsiteSloEntity } from '@instana/types';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { ServiceLevelErrors } from 'in-service-levels/constants';

interface TagFilterQueryBuilderProps<SLO_ENTITY extends SloEntityUnion> {
  entity: SLO_ENTITY;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

export default function TagFilterQueryBuilder({
  entity,
  tagFilterExpression
}: TagFilterQueryBuilderProps<SloEntityUnion>) {
  if (isApplicationSloEntity(entity))
    return <ApplicationTagFilterQueryBuilder entity={entity} tagFilterExpression={tagFilterExpression} />;

  if (isWebsiteSloEntity(entity))
    return <WebsiteTagFilterQueryBuilder entity={entity} tagFilterExpression={tagFilterExpression} />;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

function ApplicationTagFilterQueryBuilder({
  entity,
  tagFilterExpression
}: TagFilterQueryBuilderProps<ApplicationSloEntity>) {
  const { QueryBuilder } = useApplicationQueryBuilder(entity);
  return <QueryBuilder value={fromBackendModel(tagFilterExpression)} readOnly />;
}

function WebsiteTagFilterQueryBuilder({ entity, tagFilterExpression }: TagFilterQueryBuilderProps<WebsiteSloEntity>) {
  const { QueryBuilder } = useWebsiteQueryBuilder(entity);
  return <QueryBuilder value={fromBackendModel(tagFilterExpression)} readOnly />;
}
