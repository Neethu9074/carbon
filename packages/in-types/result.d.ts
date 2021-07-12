/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface ResultProgress {
  readonly percentage?: number;
  readonly loading: boolean;
  readonly note?: string;
}

export type ResultErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'AUTH'
  | 'TOO_MANY_REQUESTS'
  | 'CLIENT'
  | 'TIMEOUT'
  | 'SERVER'
  | 'UNAVAILABLE'
  | 'GATEWAY_TIMEOUT';

export interface ResultError {
  readonly message: string;
  readonly code: ResultErrorCode;
}

export interface Result<T> {
  readonly data?: T;
  readonly time?: number;
  readonly adjustedWindowSize?: number;
  readonly errors: Readonly<ResultError[]>
  readonly progress: Readonly<ResultProgress>
}
