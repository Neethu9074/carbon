/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aspnetmvccontroller',
  category: 'generic',

  typeName: {
    singular: t('in-forge:tracing.aspNetMvcController.indexName'),
    plural: t('in-forge:tracing.aspNetMvcController.indexName_plural')
  },

  detailView: 'AspNetMvcControllerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  }
});
