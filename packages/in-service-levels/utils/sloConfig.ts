/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/*
 * disable prefer-default-export rule in order to allow no-default export for
 * this utils file
 */
/* eslint import/prefer-default-export: 0 */

import { isApplicationSloEntity, isSyntheticSloEntity, isWebsiteSloEntity, SloEntityUnion } from '@instana/types';

import { ServiceLevelErrors } from 'in-service-levels/constants';

export function getSloEntityIds(entity: SloEntityUnion): string[] {
  if (isApplicationSloEntity(entity)) return [entity.applicationId];

  if (isWebsiteSloEntity(entity)) return [entity.websiteId];

  if (isSyntheticSloEntity(entity)) return entity.syntheticTestIds;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
