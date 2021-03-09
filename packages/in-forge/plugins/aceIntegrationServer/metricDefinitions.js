/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['heapMemInitial', 'heapMemMax', 'heapMemCommitted', 'heapMemUsed'],
    labels: [
      t('in-forge:plugins.aceIntegrationServer.heapMemInitial'),
      t('in-forge:plugins.aceIntegrationServer.heapMemMax'),
      t('in-forge:plugins.aceIntegrationServer.heapMemCommitted'),
      t('in-forge:plugins.aceIntegrationServer.heapMemUsed')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceIntegrationServer.jvmHeapMemory')],
    formatter: bytes
  },
  {
    metrics: ['nonHeapMemInitial', 'nonHeapMemMax', 'nonHeapMemCommitted', 'nonHeapMemUsed'],
    labels: [
      t('in-forge:plugins.aceIntegrationServer.nonHeapMemInitial'),
      t('in-forge:plugins.aceIntegrationServer.nonHeapMemMax'),
      t('in-forge:plugins.aceIntegrationServer.nonHeapMemCommitted'),
      t('in-forge:plugins.aceIntegrationServer.nonHeapMemUsed')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceIntegrationServer.jvmNonHeapMemory')],
    formatter: bytes
  }
];
