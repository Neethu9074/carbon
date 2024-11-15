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

// id is optional since the request body of the perspective API does not need the id since it is supplied as part of the URL
// This type is a catch all for multiple various perspective formats used in different parts of the UI
export interface PerspectiveItem {
  id?: string;
  description?: string;
  name: string;
  tagFilterExpression?: TagFilterExpressionElementUnion | FormModelElement[];
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

export interface HttpResponse {
  name: string;
  response: {
    status: number;
    statusText: string;
    body: {
      errors: string[];
    };
  };
}

// The params needed to populate the URL for a specific business process dashboard
export interface ProcessMatrixParams {
  name: string;
  definitionId: string;
  serviceId: string;
}

// The params needed to populate the URL for a specific business activity dashboard
export interface ActivityMatrixParams {
  process: ProcessMatrixParams;
  activity: {
    name: string;
    id: string;
  };
}
