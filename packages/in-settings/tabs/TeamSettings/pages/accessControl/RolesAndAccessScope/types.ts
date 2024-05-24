/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApiGroup } from '@instana/types';

export interface GroupApiResult {
  result: { group: ApiGroup };
}
export type ExtractIdFunction<I> = (entity: I) => string;
export type ExtractNameFunction<I> = (entity: I) => string;
export type ExtractContributionFilterNameFunction<I> = (entity: I) => string;
