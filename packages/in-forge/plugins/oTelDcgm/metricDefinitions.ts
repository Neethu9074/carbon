/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Could not find a declaration file for module
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_GPU_TEMP', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_GPU_TEMP'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_POWER_USAGE', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_POWER_USAGE'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_SM_CLOCK', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_SM_CLOCK'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_MEM_CLOCK', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_MEM_CLOCK'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_GPU_UTIL', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_GPU_UTIL'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_MEM_COPY_UTIL', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_MEM_COPY_UTIL'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_FB_USED', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_FB_USED'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('DCGM_FI_DEV_FB_FREE', null, 'GPU Core'),
    label: t('in-forge:plugins.oTelDcgm.DCGM_FI_DEV_FB_FREE'),
    min: 0,
    category: [t('in-forge:plugins.oTelDcgm.label_category_Availability')],
    formatter: number
  }
];
