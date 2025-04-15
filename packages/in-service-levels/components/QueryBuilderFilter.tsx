/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SloEntityUnion } from '@instana/types';

import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import type { QueryBuilderComponent } from 'in-components/QueryBuilder';

interface QueryBuilderFilterProps {
  entity: SloEntityUnion;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function QueryBuilderFilter({ entity, QueryBuilderComponent }: QueryBuilderFilterProps) {
  const { tagFilterExpression } = entity;

  if (!tagFilterExpression) return null;

  return <QueryBuilderComponent value={fromBackendModel(tagFilterExpression)} readOnly />;
}
