/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagCatalog } from '@instana/types';

import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { successObservable } from 'in-services/util/result';

/**
 * Creates a QueryBuilder that is bound to a single Infrastructure.
 * Consequently, the suggestions shown are only part of that limited scope.
 *
 * @returns A QueryBuilder
 */
export function CreateBoundedAlertQueryBuilder(tagCatalog: TagCatalog): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => successObservable(tagCatalog)
  });
}

/**
 * It can be used for accessing the tagCatalog and do a query validation.
 */
export function getQueryBuilder(tagCatalog: TagCatalog): CreateQueryBuilderResponse {
  return CreateBoundedAlertQueryBuilder(tagCatalog);
}
