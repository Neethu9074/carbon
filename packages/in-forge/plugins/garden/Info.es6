import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import List from 'in-sdk/components/sidebar/List';

export default function GardenInfo({ snapshot }) {
  const data = snapshot.get('data');
  const ports = data.get('mappedPorts');
  const processIds = data.get('processIDs');
  const events = data.get('events');

  return (
    <DescriptionList>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Container IP">{data.get('containerIP')}</DescriptionItem>
      <DescriptionItem title="Host IP">{data.get('hostIP')}</DescriptionItem>
      <DescriptionItem title="Container Path">{data.get('containerPath')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
      <DescriptionItem title="App Id">{data.get('appId')}</DescriptionItem>
      <DescriptionItem title="Group Id">{data.get('groupId')}</DescriptionItem>
      <DescriptionItem title="Org Id">{data.get('orgId')}</DescriptionItem>
      <DescriptionItem title="Space Id">{data.get('spaceId')}</DescriptionItem>

      {ports && ports.size > 0 ? (
        <DescriptionItem title="Mapped Ports">
          <List>
            {ports.map(port => (
              <List.Item key={port}>{port}</List.Item>
            ))}
          </List>
        </DescriptionItem>
      ) : null}

      {events && events.size > 0 ? (
        <DescriptionItem title="Events">
          <List>
            {events.map(event => (
              <List.Item key={event}>{event}</List.Item>
            ))}
          </List>
        </DescriptionItem>
      ) : null}

      {processIds && processIds.size > 0 ? (
        <DescriptionItem title="Process IDs">
          <List>
            {processIds.map(processID => (
              <List.Item key={processID}>{processID}</List.Item>
            ))}
          </List>
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
