/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalHits: number;
}
