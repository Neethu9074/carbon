/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'webapi',
  category: t('in-forge:tracingCategory.generic'),

  detailView: 'WebApiSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'webapi', 'controller']);
  }
});
