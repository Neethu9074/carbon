/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/log/spanDefinition';
import { t } from 'in-i18n';

export default logSpanDefinition('log');

export function logSpanDefinition(type) {
  return {
    type: type,
    category: 'logger',

    typeName: {
      singular: t('in-forge:tracing.log.indexName'),
      plural: t('in-forge:tracing.log.indexName_plural')
    },

    detailView: 'LogSpanDetailView',

    getLabel
  };
}
