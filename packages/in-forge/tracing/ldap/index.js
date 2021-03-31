/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ldap',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'LdapSpanDetailView',

  getLabel(span) {
    const query = span.getIn(['data', 'ldap', 'query'], '<unknown>');
    if (query == null) {
      return t('in-forge:tracing.ldap.indexReturn');
    }

    return t('in-forge:tracing.ldap.indexReturnWithQuery', { ldapQuery: query });
  }
});
