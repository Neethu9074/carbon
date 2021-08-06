/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { t } from 'in-i18n';

export const ruleAggregationOptions = Object.freeze([
  { value: 'MEAN', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionMEAN') },
  { value: 'MIN', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionMIN') },
  { value: 'P25', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP25') },
  { value: 'P50', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP50') },
  { value: 'P75', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP75') },
  { value: 'P90', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP90') },
  { value: 'P95', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP95') },
  { value: 'P98', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP98') },
  { value: 'P99', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionP99') },
  { value: 'MAX', label: t('in-alerting:smartAlerts.form.ruleAggregationOptionMAX') }
]);

export const ruleAggregationForWeeklySeasonalityOptions = Object.freeze([
  {
    value: 'MEAN',
    label: t('in-alerting:smartAlerts.form.ruleAggregationForWeeklySeasonalityOptionMEAN')
  },
  { value: 'P50', label: t('in-alerting:smartAlerts.form.ruleAggregationForWeeklySeasonalityOptionP50') }
]);
