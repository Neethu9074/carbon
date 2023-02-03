/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { GroupWithRoles } from '@instana/types';

export interface GroupApiResult {
  result: { group: GroupWithRoles };
}
export type ExtractIdFunction<I> = (entity: I) => string;
export type ExtractNameFunction<I> = (entity: I) => string;
