/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ace',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'AceSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'ace', 'flow'], '<unknown>');
    const destination = span.getIn(['data', 'ace', 'id']);
    if (destination == null) {
      return label;
    }

    return t('in-forge:tracing.jms.indexReturn', { returnLabel: label, returnDestination: destination });
  }
});
