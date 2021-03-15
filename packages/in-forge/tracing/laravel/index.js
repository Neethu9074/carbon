/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'laravel',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: t('in-forge:tracing.laravel.indexName'),
    plural: t('in-forge:tracing.laravel.indexName_plural')
  },

  detailView: 'LaravelSpanDetailView',

  getLabel(span) {
    const controller = span.getIn(['data', 'laravel', 'controller']);
    const action = span.getIn(['data', 'laravel', 'action']);

    if (controller && action) {
      return controller + '@' + action;
    }
    // Closure
    if (controller && !action) {
      return controller;
    }
    if (!controller && !action) {
      return 'Unknown@' + 'unknown';
    }
    return t('in-forge:tracing.laravel.indexReturn');
  }
});
