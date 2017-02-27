import React from 'react';

import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import {getLogViewLinkWithQuery} from 'in-stores/navigation/view';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import InterfaceList from 'in-forge/plugins/host/InterfaceList';
import {getLogQueryForHost, getLogCount} from 'in-stores/logs';
import HostHardware from 'in-forge/plugins/host/HostHardware';
import Separator from 'in-sdk/components/sidebar/Separator';
import TagList from 'in-sdk/components/sidebar/TagList';

import Info from '../Info';

export default function HostSidebar({snapshot}) {
  const query = getLogQueryForHost(snapshot.get('id'));

  return (
    <div>
      <Separator />

      <CountBasedJumpToButton href$={getLogViewLinkWithQuery(query)}
                              count$={getLogCount(query)}
                              title='Logs'
                              tooltip='Show logs for this host' />

      <Collapsible initiallyOpen>
        <Collapsible.Header>System</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <InterfaceList snapshot={snapshot} />

      <HostHardware snapshotId={snapshot.get('id')} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
