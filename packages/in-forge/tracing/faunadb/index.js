/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'faunadb',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.faunadb.indexName'),
    plural: t('in-forge:tracing.faunadb.indexName_plural')
  },

  detailView: 'FaunaDBSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.faunadb.indexReturn');
  }
});
