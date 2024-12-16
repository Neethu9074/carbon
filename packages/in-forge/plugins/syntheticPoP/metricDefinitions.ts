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
      'browserscript.activeTests',
      'browserscript.scheduledTasks',
      'browserscript.completedTasks',
      'browserscript.queueDepth'
    ],
    labels: [
      t('in-forge:plugins.syntheticPoP.active'),
      t('in-forge:plugins.syntheticPoP.scheduled'),
      t('in-forge:plugins.syntheticPoP.completed'),
      t('in-forge:plugins.syntheticPoP.queueDepth')
    ],
    min: 0,
    category: [t('in-forge:plugins.syntheticPoP.browser')],
    formatter: number
  },
  {
    metrics: [
      'javascript.activeTests',
      'javascript.scheduledTasks',
      'javascript.completedTasks',
      'javascript.queueDepth'
    ],
    labels: [
      t('in-forge:plugins.syntheticPoP.active'),
      t('in-forge:plugins.syntheticPoP.scheduled'),
      t('in-forge:plugins.syntheticPoP.completed'),
      t('in-forge:plugins.syntheticPoP.queueDepth')
    ],
    min: 0,
    category: [t('in-forge:plugins.syntheticPoP.javascript')],
    formatter: number
  },
  {
    metrics: ['http.activeTests', 'http.scheduledTasks', 'http.completedTasks', 'http.queueDepth'],
    labels: [
      t('in-forge:plugins.syntheticPoP.active'),
      t('in-forge:plugins.syntheticPoP.scheduled'),
      t('in-forge:plugins.syntheticPoP.completed'),
      t('in-forge:plugins.syntheticPoP.queueDepth')
    ],
    min: 0,
    category: [t('in-forge:plugins.syntheticPoP.http')],
    formatter: number
  },
  {
    metrics: ['ism.activeTests', 'ism.scheduledTasks', 'ism.completedTasks', 'ism.queueDepth'],
    labels: [
      t('in-forge:plugins.syntheticPoP.active'),
      t('in-forge:plugins.syntheticPoP.scheduled'),
      t('in-forge:plugins.syntheticPoP.completed'),
      t('in-forge:plugins.syntheticPoP.queueDepth')
    ],
    min: 0,
    category: [t('in-forge:plugins.syntheticPoP.ism')],
    formatter: number
  },
  {
    metrics: ['resultQueueDepth'],
    labels: [t('in-forge:plugins.syntheticPoP.resultQueueDepth')],
    min: 0,
    formatter: number
  }
];
