/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'php',
  category: t('in-forge:tracingCategory.http'),

  detailView: 'PhpSpanDetailView',

  getLabel(span) {
    const url = span.getIn(['data', 'http', 'url']);
    const method = span.getIn(['data', 'http', 'method']);
    const script = span.getIn(['data', 'php', 'script']);
    const args = span.getIn(['data', 'php', 'argv']);

    if (url && method) {
      return method + ' ' + url;
    } else if (url) {
      return url;
    } else if (method) {
      return method;
    } else if (script && args) {
      return script + ' ' + args;
    } else if (script) {
      return script;
    }
    return span.getIn(['data', 'php', 'sapi']);
  }
});
