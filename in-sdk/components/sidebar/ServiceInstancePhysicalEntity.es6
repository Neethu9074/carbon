import React from 'react';

import {getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

import SnapshotForgeInfo from 'in-sdk/components/sidebar/SnapshotForgeInfo';

import './ServiceInstancePhysicalEntity.less';

const block = 'in-service-instana-physical-entity';

export default connectTo(props => {
  const phsicalEntityId$ = getClusterMembers(props.snapshotId)
    .map(clusterMembers => clusterMembers.first());

  return {
    snapshot: phsicalEntityId$.flatMap(id => id ? getSnapshot(id) : alwaysNull),
    href: phsicalEntityId$.flatMap(id => id ? getLinkToSnapshotInCurrentView(id) : alwaysNull)
  };
}, function ServiceInstancePhysicalEntity({snapshot, href}) {
  if (!snapshot) {
    return null;
  }

  const pluginLabel = getSingular(snapshot.get('plugin'));

  return (
    <Collapsible initiallyOpen={true}>
      <Collapsible.Header>
        {pluginLabel}: {getLabel(snapshot)}
      </Collapsible.Header>
      <Collapsible.Content>
        <Button href={href}
                kind='secondary'
                className={`${block}__open`}>
          Show {pluginLabel} details
        </Button>
        <SnapshotForgeInfo snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
});
