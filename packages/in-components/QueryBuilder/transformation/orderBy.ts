/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Order } from 'in-types';

export function toNewOrderBy(orderBy: Order['by'], orderDirection: Order['direction'] = 'DESC'): Order {
  return { by: orderBy, direction: orderDirection };
}
