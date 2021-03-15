/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mail.javamail',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.mail.indexName'),
    plural: t('in-forge:tracing.mail.indexName_plural')
  },

  detailView: 'JavamailSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mail', 'type'], '<unknown type>');
  }
});
