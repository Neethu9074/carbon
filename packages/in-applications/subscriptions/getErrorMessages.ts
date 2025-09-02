/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ErrorMessageItem,
  GetErrorMessagesQuery,
  PaginatedResult,
  Result,
  TimeConfig,
  OrderDirection,
  ApplicationBoundaryScope
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { collationLanguage } from 'in-i18n';

const getErrorMessages = createResultSubscriptionFactory<
  GetErrorMessagesQuery,
  Result<PaginatedResult<ErrorMessageItem>>
>({
  eventId: 'getErrorMessages',
  trackSubscriptionStatistics: true
});

export default getErrorMessages;

/**
 * Gets all error messages and filters afterwards.
 * This method should only be called, if the error messages table is filtered by a string that is contained in "Error without an error message".
 * This is an edge case because "Error without an error message" doesn't have any label/text,
 * which means we need to first get all messages and then filter.
 */
export function getAllErrorMessagesThenFilter({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'erroneousCallsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  boundaryScope?: ApplicationBoundaryScope;
  timeConfig: TimeConfig;
}) {
  return getErrorMessages({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection,
      collation: collationLanguage
    },
    filter: {
      label: '', // Don't use the query here, so we get all error messages
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    metrics: {
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    supportedOrderByCriteria: false
  }).map(result => {
    if (result.data && result.data.items && result.data.items.length > 0) {
      const filteredItems = result.data.items.filter(
        // include all items that match the query and items without an error message.
        // The actual label "Error without an error message" will be set afterwards in ErrorMessagesTable.
        item => !item.message || item.message.trim().toLowerCase().includes(query.trim().toLowerCase())
      );
      return {
        ...result,
        data: {
          ...result.data,
          items: filteredItems,
          totalHits: filteredItems.length
        }
      };
    }

    return result;
  });
}
