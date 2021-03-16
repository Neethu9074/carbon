/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ftp',
  category: 'io',

  typeName: {
    singular: t('in-forge:tracing.ftp.indexName'),
    plural: t('in-forge:tracing.ftp.indexName_plural')
  },

  detailView: 'FTPSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ftp', 'type']) + ' ' + span.getIn(['data', 'ftp', 'file']);
  }
});
