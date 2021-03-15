/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'http4s.server',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.http4sServer.indexName'),
    plural: t('in-forge:tracing.http4sServer.indexName_plural')
  },

  detailView: 'Http4sServerSpanDetailView',

  getLabel
});
