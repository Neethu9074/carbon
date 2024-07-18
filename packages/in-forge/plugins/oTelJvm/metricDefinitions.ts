/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Could not find a declaration file for module
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'blocked', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_blocked'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'new', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_new'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'runnable', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_runnable'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'terminated', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_terminated'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'timed-waiting', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_timed-waiting'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.threads.states', 'waiting', '_'),
    label: t('in-forge:plugins.oTelJvm.jvm_threads_states_waiting'),
    min: 0,
    category: [t('in-forge:plugins.oTelJvm.label_category_Thread_State')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'codeHeapNonMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'codeHeapProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'g1SurvSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1SurvSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'metaspace', '_'),
    label: t('in-forge:plugins.oTelJvm.metaspace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'g1EdenSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1EdenSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'g1OldGen', '_'),
    label: t('in-forge:plugins.oTelJvm.g1OldGen'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'codeHeapNonProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'compClassSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.compClassSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'totalHeap', '_'),
    label: t('in-forge:plugins.oTelJvm.totalHeap'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.used', 'usedHeapInPercentage', '_'),
    label: t('in-forge:plugins.oTelJvm.usedHeapInPercentage'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Used')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'codeHeapNonMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'codeHeapProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'g1SurvSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1SurvSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'metaspace', '_'),
    label: t('in-forge:plugins.oTelJvm.metaspace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'g1EdenSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1EdenSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'g1OldGen', '_'),
    label: t('in-forge:plugins.oTelJvm.g1OldGen'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'codeHeapNonProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'compClassSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.compClassSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'totalHeap', '_'),
    label: t('in-forge:plugins.oTelJvm.totalHeap'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('process.runtime.jvm.memory.init', 'usedHeapInPercentage', '_'),
    label: t('in-forge:plugins.oTelJvm.usedHeapInPercentage'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Init')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'codeHeapNonMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'codeHeapProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'g1SurvSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1SurvSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'metaspace', '_'),
    label: t('in-forge:plugins.oTelJvm.metaspace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'g1EdenSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.g1EdenSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'g1OldGen', '_'),
    label: t('in-forge:plugins.oTelJvm.g1OldGen'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'codeHeapNonProfMethods', '_'),
    label: t('in-forge:plugins.oTelJvm.codeHeapNonProfMethods'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'compClassSpace', '_'),
    label: t('in-forge:plugins.oTelJvm.compClassSpace'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'totalHeap', '_'),
    label: t('in-forge:plugins.oTelJvm.totalHeap'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('jvm.memory.max', 'usedHeapInPercentage', '_'),
    label: t('in-forge:plugins.oTelJvm.usedHeapInPercentage'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelJvm.label_category_Memory_Max')],
    formatter: percentage
  }
];
