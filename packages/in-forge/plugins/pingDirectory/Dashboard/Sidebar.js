/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import LdapConnectors from '../LdapConnectors';
import Databases from '../Databases';
import { t } from 'in-i18n';
import Info from '../Info';

export default function PingDirectorySidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.pingDirectory.dashboard.pingIdentityDirectoryServer')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <LdapConnectors snapshot={snapshot} />
      <Databases snapshot={snapshot} />
    </div>
  );
}
