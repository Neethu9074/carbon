/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'actioncontroller',
  category: t('in-forge:tracingCategory.generic', 'generic'),

  detailView: 'ActionControllerSpanDetailView',

  getLabel(span) {
    return (
      span.getIn(['data', 'actioncontroller', 'controller']) + '#' + span.getIn(['data', 'actioncontroller', 'action'])
    );
  }
});
