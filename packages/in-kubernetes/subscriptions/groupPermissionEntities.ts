/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ContextQuery, FilterInterface, Order } from '@instana/types';

/**
 * Model for the response of the permission ws API
 * @property id - id of the entity
 * @property name - display name of the entity
 */
export interface GroupPermissionEntity {
  readonly id: string;
  readonly name: string;
}

/**
 * Model for a query of the permission entities
 * @property filter (timebased)
 * @property order to order the returned list
 */
export interface GetGroupPermissionEntitiesQuery extends ContextQuery {
  readonly filter: FilterInterface;
  readonly order: Order;
}
