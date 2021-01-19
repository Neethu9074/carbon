/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function toNewOrderBy(orderBy, orderDirection = 'DESC') {
  return { by: orderBy, direction: orderDirection };
}
