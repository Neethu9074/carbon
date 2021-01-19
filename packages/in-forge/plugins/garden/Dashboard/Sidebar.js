/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import CloudfoundryInfo from 'in-forge/plugins/garden/CloudfoundryInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { pcfEnabled } from 'in-services/featureFlags';
import List from 'in-sdk/components/sidebar/List';

import Info from 'in-forge/plugins/garden/Info';

export default function GardenSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const ports = data.get('mappedPorts');
  const events = data.get('events');
  const processIds = data.get('processIDs');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Garden Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {pcfEnabled && <CloudfoundryInfo snapshot={snapshot} />}

      {ports && ports.size > 0 && (
        <Collapsible>
          <Collapsible.Header>Ports</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {ports.map(port => (
                <List.Item key={port}>{port}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      )}

      {events && events.size > 0 && (
        <Collapsible>
          <Collapsible.Header>Events</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {events.map(item => (
                <List.Item key={item}>{item}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      )}

      {processIds && processIds.size > 0 && (
        <Collapsible>
          <Collapsible.Header>Process IDs</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {processIds.map(item => (
                <List.Item key={item}>{item}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      )}

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
