/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AggregationType, BlueprintType, SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

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
  UNEXPECTED_SLO_CREATION_ERROR: 'unexpected SLO creation error'
});

type TimeAggregationOptions = {
  value: AggregationType;
  label: string;
}[];

export const timeAggregationOptions: TimeAggregationOptions = deepFreeze([
  { value: 'MEAN', label: t('in-service-levels:general.indicator.aggregation_MEAN') },
  { value: 'MIN', label: t('in-service-levels:general.indicator.aggregation_MIN') },
  { value: 'P25', label: t('in-service-levels:general.indicator.aggregation_P25') },
  { value: 'P50', label: t('in-service-levels:general.indicator.aggregation_P50') },
  { value: 'P75', label: t('in-service-levels:general.indicator.aggregation_P75') },
  { value: 'P90', label: t('in-service-levels:general.indicator.aggregation_P90') },
  { value: 'P95', label: t('in-service-levels:general.indicator.aggregation_P95') },
  { value: 'P98', label: t('in-service-levels:general.indicator.aggregation_P98') },
  { value: 'P99', label: t('in-service-levels:general.indicator.aggregation_P99') },
  { value: 'MAX', label: t('in-service-levels:general.indicator.aggregation_MAX') }
]);

export const defaultBlueprint: BlueprintType = 'availability';

export const SloTimeWindowTypes = Object.freeze({
  SELECTED_TIME: 'SELECTED_TIME',
  SLO_TIME_WINDOW: 'SLO_TIME_WINDOW'
});
