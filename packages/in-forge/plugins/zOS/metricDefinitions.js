/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { percentagePlainZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'System_CPU_Utilization.average_cpu_percent',
      'System_CPU_Utilization.average_ifa_percent',
      'System_CPU_Utilization.average_ifa_on_cp_percent',
      'System_CPU_Utilization.average_ziip_percent',
      'System_CPU_Utilization.average_ziip_on_cp_percent',
      'System_CPU_Utilization.mvs_overhead',
      'System_CPU_Utilization.percent_lpar_msu_capacity'
    ],
    labels: [
      t('in-forge:plugins.zOS.avgCpuPercentage'),
      t('in-forge:plugins.zOS.avgIfaPercentage'),
      t('in-forge:plugins.zOS.avgIfaCpPercentage'),
      t('in-forge:plugins.zOS.avgziipPercentage'),
      t('in-forge:plugins.zOS.avgziipCpPercentage'),
      t('in-forge:plugins.zOS.mvsOverhead'),
      t('in-forge:plugins.zOS.percentLparMsuCapacity')
    ],
    min: 0,
    max: 100,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: ['System_CPU_Utilization.average_unused_group_msus', 'System_CPU_Utilization.four_hour_msus'],
    labels: [t('in-forge:plugins.zOS.averageUnusedGroupMsus'), t('in-forge:plugins.zOS.fourHourMsus')],
    min: 0,
    max: 100,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'total_frames',
        t('in-forge:plugins.zOS.realStorage.totalFrames')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'active_frames',
        t('in-forge:plugins.zOS.realStorage.activeFrames')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'idle_frames',
        t('in-forge:plugins.zOS.realStorage.idleFrames')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'auxiliary_storage_slots',
        t('in-forge:plugins.zOS.realStorage.auxStorageSlots')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'memory_objects_allocated',
        t('in-forge:plugins.zOS.realStorage.memoryObjectsAllocated')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'one_meg_frames_in_real',
        t('in-forge:plugins.zOS.realStorage.oneMegFramesInReal')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'active_frames_working_set',
        t('in-forge:plugins.zOS.realStorage.activeFramesWorkingSet')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'active_frames_fixed',
        t('in-forge:plugins.zOS.realStorage.activeFramesFixed')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'active_frames_div',
        t('in-forge:plugins.zOS.realStorage.activeFramesDiv')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'page_in_rate',
        t('in-forge:plugins.zOS.realStorage.pageInRage')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'shared_page_in_rate',
        t('in-forge:plugins.zOS.realStorage.sharedPageInRate')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'shared_pages_total_views',
        t('in-forge:plugins.zOS.realStorage.sharedPagesTotalViews')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'shared_pages_total_valid',
        t('in-forge:plugins.zOS.realStorage.sharedPagesTotalValid')
      ),
      getDynamicMetricMatch(
        'Real_Storage_Utilization_History',
        'shared_pages_validation_rate',
        t('in-forge:plugins.zOS.realStorage.sharedPagesValidationRate')
      )
    ],
    labels: [
      t('in-forge:plugins.zOS.realStorage.totalFrames'),
      t('in-forge:plugins.zOS.realStorage.activeFrames'),
      t('in-forge:plugins.zOS.realStorage.idleFrames'),
      t('in-forge:plugins.zOS.realStorage.auxStorageSlots'),
      t('in-forge:plugins.zOS.realStorage.memoryObjectsAllocated'),
      t('in-forge:plugins.zOS.realStorage.oneMegFramesInReal'),
      t('in-forge:plugins.zOS.realStorage.activeFramesWorkingSet'),
      t('in-forge:plugins.zOS.realStorage.activeFramesFixed'),
      t('in-forge:plugins.zOS.realStorage.activeFramesDiv'),
      t('in-forge:plugins.zOS.realStorage.pageInRage'),
      t('in-forge:plugins.zOS.realStorage.sharedPageInRate'),
      t('in-forge:plugins.zOS.realStorage.sharedPagesTotalViews'),
      t('in-forge:plugins.zOS.realStorage.sharedPagesTotalValid'),
      t('in-forge:plugins.zOS.realStorage.sharedPagesValidationRate')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'percentage_csa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'percentage_ecsa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'percentage_sqa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'percentage_esqa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'amount_csa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'amount_ecsa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'amount_sqa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      ),
      getDynamicMetricMatch(
        'Common_Storage_Utilization_History',
        'amount_esqa_in_use',
        t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse')
      )
    ],
    labels: [
      t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse'),
      t('in-forge:plugins.zOS.commonStorage.percentageEcsaInUse'),
      t('in-forge:plugins.zOS.commonStorage.percentageSqaInUse'),
      t('in-forge:plugins.zOS.commonStorage.percentageEsqaInUse'),
      t('in-forge:plugins.zOS.commonStorage.amountCsaInUse'),
      t('in-forge:plugins.zOS.commonStorage.amountEcsaInUse'),
      t('in-forge:plugins.zOS.commonStorage.amountSqaInUse'),
      t('in-forge:plugins.zOS.commonStorage.amountEsqaInUse')
    ],
    min: 0,
    formatter: number.detailed
  }
];
