/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import List from 'in-sdk/components/sidebar/List';
import { t } from 'in-i18n';

export default function LdapConnectors({ snapshot }) {
  const data = snapshot.get('data');
  const connectorNames = data.get('ldap_connectors.names');
  if (!connectorNames) {
    return null;
  }
  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>{t('in-forge:plugins.pingDirectory.ldapConnectors')}</Collapsible.Header>
      <Collapsible.Content>
        <List>
          {connectorNames.map((name, i) => (
            <List.Item key={i}>{name + ' (' + data.get('ldap_connectors.data.' + name + '.protocol') + ')'}</List.Item>
          ))}
        </List>
      </Collapsible.Content>
    </Collapsible>
  );
}
