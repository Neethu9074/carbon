/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ibm-mq',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'IbmmqSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'ibm-mq', 'queue'], '<unknown>');
    const destination = span.getIn(['data', 'ibm-mq', 'id']);
    if (destination == null) {
      return label;
    }

    return t('in-forge:tracing.jms.indexReturn', { returnLabel: label, returnDestination: destination });
  }
});
