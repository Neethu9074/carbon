/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ejb',
  category: t('in-forge:tracingCategory.remote', 'remote'),

  detailView: 'EJBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'method']);
  }
});
