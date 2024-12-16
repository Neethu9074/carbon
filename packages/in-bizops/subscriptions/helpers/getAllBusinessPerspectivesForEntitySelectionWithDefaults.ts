/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { OrderDirection, TimeConfig } from '@instana/types';

import getAllBusinessPerspectivesForEntitySelection from 'in-bizops/subscriptions/getAllBusinessPerspectivesForEntitySelection';

interface QueryParams {
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getAllBusinessPerspectivesForEntitySelectionWithDefaults({
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getAllBusinessPerspectivesForEntitySelection({
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig
    }
  });
}
