/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'datapower.internal',
  category: t('in-forge:tracingCategory.http'),

  detailView: 'DataPowerInternalSpanDetailView',

  getLabel(span) {
    const method = span.getIn(['data', 'http', 'method'], '<unknown_method>');
    const path = span.getIn(['data', 'http', 'path'], '<unknown_path>');

    return `${method} ${path}`;
  }
});
