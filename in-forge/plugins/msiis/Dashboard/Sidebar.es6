import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import AppPoolList from '../AppPoolList.es6';
import WebSiteList from '../WebSiteList.es6';
import Info from '../Info';


export default function MsIISSidebar({snapshot}) {
  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>Internet Information Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Web-Sites</Collapsible.Header>
        <Collapsible.Content>
          <WebSiteList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Application-Pools</Collapsible.Header>
        <Collapsible.Content>
          <AppPoolList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
