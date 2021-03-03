/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

export const resourceQuotaPercentage = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : percentageTwoDecimalPlaces(d);
export const resourceQuotaBytes = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : bytesTwoDecimalPlaces(d);
export const resourceQuotaTwoDecimalPlaces = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : twoDecimalPlaces(d);
export const resourceQuotaZeroDecimalPlaces = d =>
  d < 0 ? t('in-forge:plugins.kubernetesCluster.noResourceQuota') : zeroDecimalPlaces(d);
