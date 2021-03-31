/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'shell',
  category: t('in-forge:tracingCategory.http'),

  detailView: 'ShellSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'shell', 'cmd']);
  }
});
