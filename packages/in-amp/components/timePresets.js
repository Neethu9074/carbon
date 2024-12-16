/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { days } from 'in-services/time';
import { t } from 'in-i18n';

const presets = [
  {
    windowSize: days.toMillis(7),
    to: null,
    label: t('in-amp:components.timePresets.last7Days')
  },
  {
    windowSize: days.toMillis(30),
    to: null,
    label: t('in-amp:components.timePresets.last30Days')
  },
  {
    windowSize: days.toMillis(365),
    to: null,
    label: t('in-amp:components.timePresets.last365Days')
  }
];

export default presets;
