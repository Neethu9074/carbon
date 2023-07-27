/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

import { deepFreeze } from 'in-services/util/object';

export const SLO_TARGET_DECIMAL_PRECISION = 2;

interface EntityTypeData {
  label: string;
  value: SloEntityType;
}

export const entityTypes: Record<SloEntityType, EntityTypeData> = {
  application: {
    label: t('in-service-levels:general.entityTypes.label', { context: 'application' }),
    value: 'application'
  },
  website: { label: t('in-service-levels:general.entityTypes.label', { context: 'website' }), value: 'website' }
};

export const sloEntityTypes = Object.keys(entityTypes) as SloEntityType[];

export interface LabeledEntity {
  label: string;
}

export const enabledBeaconTypes = deepFreeze(['httpRequest', 'pageLoad', 'custom'] as const);

export const ServiceLevelErrors = Object.freeze({
  UNHANDLED_SLO_ENTITY_TYPE: 'unhandled SLO entity type',
  UNHANDLED_SLI_TYPE: 'unhandled SLI type',
  UNEXPECTED_SLO_CREATION_ERROR: 'unexpected SLO creation error'
});
