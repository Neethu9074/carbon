/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'file',
  category: t('in-forge:tracingCategory.io', 'io'),

  detailView: 'FileSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'file', 'access']) + ' ' + span.getIn(['data', 'file', 'path']);
  }
});
