/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'haskell.wai.server',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.haskellWei.indexName'),
    plural: t('in-forge:tracing.haskellWei.indexName_plural')
  },

  detailView: 'HaskellWaiHttpServerSpanDetailView',

  getLabel
});
