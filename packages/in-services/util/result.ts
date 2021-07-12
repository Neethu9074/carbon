/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import deepFreeze from 'deep-freeze-strict';

import { just } from '@instana/observables';

import { emptyArray, finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { PaginatedResult } from 'in-types/paginatedResult';
import {Result, ResultError} from 'in-types/result';

export function mapData<IN, OUT>(result: Result<IN>, fn: (data: IN) => OUT): Result<OUT> {
  if (result.data != null) {
    return deepFreeze({
      ...result,
      data: fn(result.data)
    });
  }

  // @ts-ignore Data is null and therefore this is type compatible.
  return result as Result<OUT>;
}

/**
 * Higher order mapping - returns a function that takes a result and applies the given mapping function in case the
 * result has data, or returns an unmodified result otherwise.
 */
export function mapDataHO<IN, OUT>(fn: (data: IN) => OUT): (input: Result<IN>) => Result<OUT> {
  return result => mapData(result, fn);
}

export function success<T>(data: T, time = Date.now()): Result<T> {
  return deepFreeze({
    data,
    errors: emptyArray,
    progress: finishedProgress,
    time
  });
}

export function error<T>(errors: ResultError[], time = Date.now()): Result<T> {
  return deepFreeze({
    errors,
    progress: finishedProgress,
    time
  });
}

export function errorWithData<T>(errors: ResultError[], data: T, time = Date.now()): Result<T> {
  return deepFreeze({
    data,
    errors,
    progress: finishedProgress,
    time
  });
}

export function listSuccess<T>(data: T[],
    totalHits = data.length,
    pageSize = data.length,
    page = 0,
    time = Date.now()): Result<PaginatedResult<T>> {
  return success(
    {
      items: data,
      pageSize,
      page,
      totalHits
    },
    time
  );
}

export const emptyListResult = listSuccess([]);

export const loading = pendingResult;

export function successObservable<T>(data: T, time = Date.now()) {
  return just(success(data, time));
}

export function successObservableFactory<T>(data: T, time = Date.now()) {
  return () => just(success(data, time));
}

export function noResultObservable() {
  return successObservable(emptyArray);
}

export function hasError(result: Result<any>) {
  return result?.errors?.length > 0;
}

export function isLoading(result: Result<any>) {
  return Boolean(result?.progress?.loading);
}
