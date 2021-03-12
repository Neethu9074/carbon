/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'docs_proc',
    label: t('in-forge:plugins.bizTalk.labelDocumentsProcessed'),
    category: [t('in-forge:plugins.bizTalk.documents')],
    min: 0,
    formatter: number
  },

  {
    metric: 'docs_resub',
    label: t('in-forge:plugins.bizTalk.labelDocumentsResubmitted'),
    category: [t('in-forge:plugins.bizTalk.documents')],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_rec',
    label: t('in-forge:plugins.bizTalk.labelDocumentsReceived'),
    category: [t('in-forge:plugins.bizTalk.documents')],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_sub',
    label: t('in-forge:plugins.bizTalk.labelDocumentsSuspended'),
    category: [t('in-forge:plugins.bizTalk.documents')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_locs',
    label: t('in-forge:plugins.bizTalk.labelActiveReceiveLocations'),
    category: [t('in-forge:plugins.bizTalk.locations')],
    min: 0,
    formatter: number
  },

  {
    metric: 'send_locs',
    label: t('in-forge:plugins.bizTalk.labelActiveSendLocations'),
    category: [t('in-forge:plugins.bizTalk.locations')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_threads',
    label: t('in-forge:plugins.bizTalk.labelActiveReceiveThreads'),
    category: [t('in-forge:plugins.bizTalk.threads')],
    min: 0,
    formatter: number
  },
  {
    metric: 'send_threads',
    label: t('in-forge:plugins.bizTalk.labelActiveSendThreads'),
    category: [t('in-forge:plugins.bizTalk.threads')],
    min: 0,
    formatter: number
  },
  {
    metric: 'delay',
    label: t('in-forge:plugins.bizTalk.labelMessageDeliveryDelay'),
    category: [t('in-forge:plugins.bizTalk.throttlingDelay')],
    min: 0,
    formatter: number
  }
];
