/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SloEntityUnion } from '@instana/types';

import { QueryBuilderComponent as QueryBuilderComponentType } from 'in-components/QueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';

interface QueryBuilderFilterProps {
  entity: SloEntityUnion;
  QueryBuilderComponent: QueryBuilderComponentType;
}

export default function QueryBuilderFilter({ entity, QueryBuilderComponent }: QueryBuilderFilterProps) {
  const { tagFilterExpression } = entity;

  if (!tagFilterExpression) return null;

  return <QueryBuilderComponent value={fromBackendModel(tagFilterExpression)} readOnly />;
}
