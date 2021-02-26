/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.azureAppService.labelArt'),
    metric: 'art',
    formatter: millis.detailed
  },
  {
    label: t('in-forge:plugins.azureAppService.labelH2x'),
    metric: 'h2x',
    formatter: number.detailed
  }
];
