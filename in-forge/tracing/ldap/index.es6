import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ldap',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'LDAP Query',
    plural: 'LDAP Queries'
  },

  detailView: 'LdapSpanDetailView',

  getLabel(span) {
    const query = span.getIn(['data', 'ldap', 'query'], '<unknown>');
    if (query == null) {
      return 'LDAP';
    }

    return 'LDAP query ' + query;
  }
});
