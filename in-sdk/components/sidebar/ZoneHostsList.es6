import React from 'react';

import {ClickableSnapshotListItem, ClickableList} from 'in-sdk/components/sidebar/ClickableList';
import {getSnapshot, getRunningComponents} from 'in-stores/snapshot';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptySet} from 'in-services/fixedImmutables';
import {alwaysNull} from 'in-services/fixedStreams';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './ZoneHostsList.less';


const block = 'in-zone-hosts-list';

export default connectTo(props => {
  return {
    snapshotIds: getClusterMembers(props.snapshotId).startWith(emptySet)
  };
}, function ZoneHostsList({snapshotIds, initiallyOpen}) {
  if (!snapshotIds || snapshotIds.size === 0) {
    return null;
  }
  return (
    <Collapsible initiallyOpen={initiallyOpen}>
      <Collapsible.Header>
        {`Hosts (${snapshotIds.size})`}
      </Collapsible.Header>
      <Collapsible.Content  className={`${block}__snapshot-list`}>
        <ClickableList>
          {snapshotIds.map(snapshotId =>
            <Host key={snapshotId}
                   snapshotId={snapshotId} />)
          }
        </ClickableList>
      </Collapsible.Content>
    </Collapsible>
  );
});


const Host = connectTo(props => {
  return {
    snapshot: getRunningComponents(props.snapshotId)
                  .flatMap(ids => {
                    return (ids && ids.size > 0)
                      ? getSnapshot(ids.toArray()[0])
                      : alwaysNull;
                  })
                  .startWith(null)
  };
},
function Entry({snapshot}) {
  if (!snapshot) {
    return null;
  }
  return (
    <ClickableSnapshotListItem snapshotId={snapshot.get('id')}>
      {getLabel(snapshot)}
    </ClickableSnapshotListItem>
  );
});
