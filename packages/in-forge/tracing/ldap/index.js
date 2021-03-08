/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ldap',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.ldap.indexName'),
    plural: t('in-forge:tracing.ldap.indexName_plural')
  },

  detailView: 'LdapSpanDetailView',

  getLabel(span) {
    const query = span.getIn(['data', 'ldap', 'query'], '<unknown>');
    if (query == null) {
      return t('in-forge:tracing.ldap.indexReturn');
    }

    return t('in-forge:tracing.ldap.indexReturnWithQuery', {ldapQuery: query});
  }
});
