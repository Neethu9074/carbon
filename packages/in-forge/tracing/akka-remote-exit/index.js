/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'akka-remote-exit',
  category: t('in-forge:tracingCategory.rpc', 'rpc'),

  detailView: 'AkkaRemoteSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'akka', 'msg']);
  }
});
