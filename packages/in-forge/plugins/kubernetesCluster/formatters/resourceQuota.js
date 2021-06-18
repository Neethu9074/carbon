/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces,
  markAsFormatterType,
  PERCENTAGE_FORMATTER_TYPE,
  BYTES_FORMATTER_TYPE
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
export const resourceQuotaTwoDecimalPlaces = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : twoDecimalPlaces(d);
export const resourceQuotaZeroDecimalPlaces = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : zeroDecimalPlaces(d);
