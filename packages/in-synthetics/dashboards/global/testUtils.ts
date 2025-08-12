/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Error, PaginatedResult, Result, TestResultListItem } from '@instana/types';

/**
 * Creates a mock Result object with empty data arrays and loading set to false
 */
function createEmptyResultsList(): Result<PaginatedResult<TestResultListItem>> {
  return {
    data: {
      items: [],
      totalHits: 0,
      page: 1,
      pageSize: 10
    },
    errors: [],
    progress: { loading: false }
  };
}

/**
 * Creates a mock Result object with loading state
 */
function createLoadingResultsList(): Result<PaginatedResult<TestResultListItem>> {
  return {
    errors: [],
    progress: { loading: true }
  };
}

/**
 * Creates a mock Result object with error state
 */
function createErrorResultsList(error: Error): Result<PaginatedResult<TestResultListItem>> {
  return {
    errors: [error],
    progress: { loading: false }
  };
}

/**
 * Creates a mock Result object with test data
 */
function createPopulatedResultsList(items: TestResultListItem[]): Result<PaginatedResult<TestResultListItem>> {
  return {
    data: {
      items,
      totalHits: items.length,
      page: 1,
      pageSize: 10
    },
    errors: [],
    progress: { loading: false }
  };
}

// Export the mock creation functions for use in tests
export { createEmptyResultsList, createLoadingResultsList, createErrorResultsList, createPopulatedResultsList };
