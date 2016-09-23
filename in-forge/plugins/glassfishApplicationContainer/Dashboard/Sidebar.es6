import React from 'react';

import ConnectionPool from 'in-forge/plugins/glassfishApplicationContainer/ConnectionPool';
import ThreadPool from 'in-forge/plugins/glassfishApplicationContainer/ThreadPool';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import JdbcPool from 'in-forge/plugins/glassfishApplicationContainer/JdbcPool';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function GlassfishSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Glassfish
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          Thread Pool
        </Collapsible.Header>
        <Collapsible.Content>
          <ThreadPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          JDBC Pool
        </Collapsible.Header>
        <Collapsible.Content>
          <JdbcPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          Connection Pool
        </Collapsible.Header>
        <Collapsible.Content>
          <ConnectionPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
