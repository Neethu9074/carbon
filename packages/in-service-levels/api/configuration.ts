/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  OrderDirection,
  PaginatedResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  SloEntityType
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { create } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const refreshSignal = create<string>().startWith('');

export interface GetAllSloConfigurationsArguments {
  page?: number;
  pageSize?: number;
  query?: string;
  tags?: string[];
  entityType?: SloEntityType;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

function getAllSloConfigurationsInternal({
  page = 1,
  pageSize = 20,
  orderDirection = 'ASC',
  tags,
  query,
  entityType,
  orderBy
}: GetAllSloConfigurationsArguments = {}) {
  return refreshSignal.flatMap(() =>
    http<PaginatedResult<ServiceLevelObjectiveConfiguration>>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/slo',
      mapToResultObject: true,
      queryParams: { page, pageSize, orderDirection, tag: tags, query, entityType, orderBy }
    })
  );
}

export const getAllSloConfigurations = memoize<
  GetAllSloConfigurationsArguments,
  Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>
>(getAllSloConfigurationsInternal, args => generateStableHash(args), minutes.toMillis(1));

function getSloTagsInternal() {
  return refreshSignal.flatMap(() =>
    http<string[]>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/slo/tags',
      mapToResultObject: true
    })
  );
}

export const getSloTags = memoize<void, Result<string[]>>(getSloTagsInternal, () => '', minutes.toMillis(1));
