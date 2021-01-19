/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ConnectionPool from 'in-forge/plugins/glassfishApplicationContainer/ConnectionPool';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import JdbcPool from 'in-forge/plugins/glassfishApplicationContainer/JdbcPool';
import AppList from 'in-forge/plugins/glassfishApplicationContainer/AppList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function GlassfishSidebar({ snapshot }) {
  const apps = snapshot.getIn(['data', 'applications']);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Glassfish</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {apps && apps.size > 0 ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Applications</Collapsible.Header>
          <Collapsible.Content>
            <AppList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>JDBC Pool</Collapsible.Header>
        <Collapsible.Content>
          <JdbcPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Connection Pool</Collapsible.Header>
        <Collapsible.Content>
          <ConnectionPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
