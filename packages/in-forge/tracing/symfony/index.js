/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'symfony',
  category: t('in-forge:tracingCategory.generic'),
  direction: 'local',

  detailView: 'SymfonySpanDetailView',

  getLabel(span) {
    const controller = span.getIn(['data', 'symfony', 'controller']);
    const action = span.getIn(['data', 'symfony', 'action']);

    if (controller && action) {
      return controller + '::' + action;
    }
    if (controller && !action) {
      return controller + '::unknown';
    }
    if (!controller && !action) {
      return 'Unknown::' + action;
    }
    return 'Symfony';
  }
});
