/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'aspnetmvccontroller',
  category: t('in-forge:tracingCategory.generic'),

  detailView: 'AspNetMvcControllerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  }
});
