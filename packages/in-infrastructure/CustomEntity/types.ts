/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  CustomEntityModel,
  InfrastructureExploreItem,
  Order,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';

export interface CustomEntityResult {
  id: string;
  version: string;
  data: CustomEntityModel;
}

export interface retrievalSize {
  retrievalSize: number;
}

export interface CustomEntityQuery {
  timeFrame: TimeConfig;
  tagFilterExpression: TagFilterExpressionElementUnion;
  query: string;
  type: string;
  order: Order;
  pagination: retrievalSize;
}

export interface CustomEntityList {
  customEntityId: string;
  item: InfrastructureExploreItem[];
}
