/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  BYTES_FORMATTER_TYPE,
  bytesTwoDecimalPlaces,
  markAsFormatterType,
  NUMBER_FORMATTER_TYPE,
  PERCENTAGE_FORMATTER_TYPE,
  percentageTwoDecimalPlaces,
  twoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export const resourceQuotaPercentage = markAsFormatterType(
  d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : percentageTwoDecimalPlaces(d)),
  PERCENTAGE_FORMATTER_TYPE
);
export const resourceQuotaBytes = markAsFormatterType(
  d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : bytesTwoDecimalPlaces(d)),
  BYTES_FORMATTER_TYPE
);
export const resourceQuotaTwoDecimalPlaces = markAsFormatterType(
  d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : twoDecimalPlaces(d)),
  NUMBER_FORMATTER_TYPE
);
export const resourceQuotaZeroDecimalPlaces = markAsFormatterType(
  d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : zeroDecimalPlaces(d)),
  NUMBER_FORMATTER_TYPE
);
