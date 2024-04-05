/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Exceptions.Number_of_erroneous_messages.J2EE_SYS_J2EEMESSAGES_ERROR.value',
      'metrics.Exceptions.Number_of_erroneous_tasks.BPM_TASK_ERRORS_INERROR.value',
      'metrics.Exceptions.Number_of_failed_process_instances.BPM_INSTANCE_ERRORS_FAILED.value',
      'metrics.Exceptions.Number_of_suspended_process_instances.BPM_INSTANCE_ERRORS_SUSPENDED.value',
      'metrics.Exceptions.Number_of_suspended_tasks.BPM_TASK_ERRORS_SUSPENDED.value',

      'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_CANCELED.value',
      'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_DELIVERED.value',

      'metrics.Performance.Number_of_active_process_instances.BPM_WORKLOAD_PROCESS_INSTANCES_ACTIVE.value',
      'metrics.Performance.Number_of_active_process_tasks.BPM_WORKLOAD_PROCESS_TASKS_ACTIVE.value',
      'metrics.Performance.Number_of_completed_process_tasks.BPM_WORKLOAD_PROCESS_TASKS_COMPLETED.value',
      'metrics.Performance.Total_number_of_process_instances.BPM_WORKLOAD_PROCESS_INSTANCES_COMPLETED.value',
      'metrics.Performance.Total_number_of_process_tasks.BPM_WORKLOAD_PROCESS_TASKS_TOTAL.value'
    ],
    labels: [
      t('in-forge:plugins.sapJavaSystem.j2EEMessagesError'),
      t('in-forge:plugins.sapJavaSystem.bPMTaskError'),
      t('in-forge:plugins.sapJavaSystem.bPMInstanceFailed'),
      t('in-forge:plugins.sapJavaSystem.bPMInstanceSuspended'),
      t('in-forge:plugins.sapJavaSystem.bPMTaskSuspended'),

      t('in-forge:plugins.sapJavaSystem.j2EEMessagesCancelled'),
      t('in-forge:plugins.sapJavaSystem.j2EEMessagesDelivered'),

      t('in-forge:plugins.sapJavaSystem.activeProcess'),
      t('in-forge:plugins.sapJavaSystem.activeTask'),
      t('in-forge:plugins.sapJavaSystem.completedTask'),
      t('in-forge:plugins.sapJavaSystem.totalProcessInstance'),
      t('in-forge:plugins.sapJavaSystem.totalProcessTask')
    ],
    min: 0,
    formatter: number.compact
  }
];
