/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { BlueprintType, SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

import { SloAggregationOptions } from 'in-service-levels/types';
import { deepFreeze } from 'in-services/util/object';

export const SLO_TARGET_DECIMAL_PRECISION = 2;
export const titleWidth = '14.7rem';

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
  UNEXPECTED_SLO_CREATION_ERROR: 'unexpected SLO creation error',
  UNSUPPORTED_TIME_WINDOW_TYPE: 'unsupported time window type',
  UNSUPPORTED_BLUEPRINT_TYPE: 'unsupported SLO blueprint type'
});

export const timeAggregationOptions: Partial<SloAggregationOptions> = Object.freeze({
  MEAN: t('in-service-levels:general.indicator.aggregation_MEAN'),
  MIN: t('in-service-levels:general.indicator.aggregation_MIN'),
  P25: t('in-service-levels:general.indicator.aggregation_P25'),
  P50: t('in-service-levels:general.indicator.aggregation_P50'),
  P75: t('in-service-levels:general.indicator.aggregation_P75'),
  P90: t('in-service-levels:general.indicator.aggregation_P90'),
  P95: t('in-service-levels:general.indicator.aggregation_P95'),
  P98: t('in-service-levels:general.indicator.aggregation_P98'),
  P99: t('in-service-levels:general.indicator.aggregation_P99'),
  MAX: t('in-service-levels:general.indicator.aggregation_MAX')
});

export const defaultBlueprint: BlueprintType = 'availability';

export const SloTimeWindowTypes = Object.freeze({
  SELECTED_TIME: 'SELECTED_TIME',
  SLO_TIME_WINDOW: 'SLO_TIME_WINDOW'
});
