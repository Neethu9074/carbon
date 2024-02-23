/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagCatalog } from '@instana/types';

import { createQueryBuilder, CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/utils/groupingUtils';
import { successObservable } from 'in-services/util/result';

/**
 * Creates a QueryBuilder that is bound to an infrastructure entity.
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

/**
 * It can be used for accessing the tagCatalog for groupBy and do a query validation.
 */
export function getGroupByQueryBuilder(tagCatalog: TagCatalog): CreateQueryBuilderResponse {
  if (tagCatalog) {
    const groupByTagCatalog = getGroupByTagCatalog(tagCatalog);
    return CreateBoundedAlertQueryBuilder(groupByTagCatalog);
  }
  return CreateBoundedAlertQueryBuilder(tagCatalog);
}
