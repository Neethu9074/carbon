/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'corba.client',
  category: t('in-forge:tracingCategory.remote', 'remote'),

  detailView: 'CorbaClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'corba', 'method']);
  }
});
