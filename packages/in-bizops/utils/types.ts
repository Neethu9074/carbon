/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  TagFilterExpressionElementUnion,
  FilteredQuery,
  TagFilterEntity,
  TagSuggestionProposeType,
  TimeConfig
} from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

// A business perspective type compatible with form building and the QueryBuilder
export interface PerspectiveFormItem {
  description: string;
  label: string;
  tagFilterExpression: FormModelElement[];
}

// id is optional since the request body of the perspective API does not need the id since it is supplied as part of the URL
export interface PerspectiveItem {
  id?: string;
  description?: string;
  label: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

export interface GetBizOpsTagSuggestionQuery extends FilteredQuery {
  readonly entity: TagFilterEntity;
  readonly tagFilterExpression: TagFilterExpressionElementUnion;
  readonly tagName: string;
  readonly key?: string;
  readonly value?: string;
  readonly propose: TagSuggestionProposeType;
  readonly timeConfig: TimeConfig;
}
