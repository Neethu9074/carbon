/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'docs_proc',
    label: t('in-forge:plugins.bizTalk.labelDocumentsProcessed'),
    category: ['Documents'],
    min: 0,
    formatter: number
  },

  {
    metric: 'docs_resub',
    label: t('in-forge:plugins.bizTalk.labelDocumentsResubmitted'),
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_rec',
    label: t('in-forge:plugins.bizTalk.labelDocumentsReceived'),
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_sub',
    label: t('in-forge:plugins.bizTalk.labelDocumentsSuspended'),
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_locs',
    label: t('in-forge:plugins.bizTalk.labelActiveReceiveLocations'),
    category: ['Locations'],
    min: 0,
    formatter: number
  },

  {
    metric: 'send_locs',
    label: t('in-forge:plugins.bizTalk.labelActiveSendLocations'),
    category: ['Locations'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_threads',
    label: t('in-forge:plugins.bizTalk.labelActiveReceiveThreads'),
    category: ['Threads'],
    min: 0,
    formatter: number
  },
  {
    metric: 'send_threads',
    label: t('in-forge:plugins.bizTalk.labelActiveSendThreads'),
    category: ['Threads'],
    min: 0,
    formatter: number
  },
  {
    metric: 'delay',
    label: t('in-forge:plugins.bizTalk.labelMessageDeliveryDelay'),
    category: ['Throttling & Delay'],
    min: 0,
    formatter: number
  }
];
