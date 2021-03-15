/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'jms',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.jms.indexName'),
    plural: t('in-forge:tracing.jms.indexName_plural')
  },

  detailView: 'JmsSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'jms', 'message'], '<unknown>');
    const destination = span.getIn(['data', 'jms', 'destination']);
    if (destination == null) {
      return label;
    }

    return t('in-forge:tracing.jms.indexReturn', { returnLabel: label, returnDestination: destination });
  }
});
