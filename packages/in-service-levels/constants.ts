/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

export const SLO_TARGET_DECIMAL_PRECISION = 2;

interface EntityTypeData {
  label: string;
}

export const entityTypes: Record<SloEntityType, EntityTypeData> = {
  application: { label: t('in-service-levels:general.entityTypes.label', { context: 'application' }) },
  website: { label: t('in-service-levels:general.entityTypes.label', { context: 'website' }) }
};
