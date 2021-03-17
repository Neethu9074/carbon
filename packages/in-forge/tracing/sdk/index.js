/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk',
  category: t('in-forge:tracingCategory.generic', 'generic'),

  detailView: 'SdkSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sdk', 'name']);
  }
});
