/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mail.actionmailer',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'ActionMailSpanDetailView',

  getLabel(span) {
    const klass = span.getIn(['data', 'actionmailer', 'class'], '<unknown class>');
    const method = span.getIn(['data', 'actionmailer', 'method'], '<unknown_method>');

    return `${klass}#${method}`;
  }
});
