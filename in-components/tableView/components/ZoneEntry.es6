import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {toggleExpandedSnapshotId} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import {groupsColorPool} from 'in-services/util/ColorGenerator';
import Entry from 'in-components/tableView/components/Entry';
import {getLabel} from 'in-sdk/snapshot';
import Icon from 'in-components/Icon';

import './ZoneEntry.less';

const block = 'in-table-view-zone-entry';

export default function ZoneEntry({snapshot, structure, highlightedSnapshotId, selectedSnapshotId,
    expandedSnapshotIds}) {
  let classes = block;

  if (highlightedSnapshotId === snapshot.get('id')) {
    classes += ' ' + block + '--highlighted';
  }

  if (selectedSnapshotId === snapshot.get('id')) {
    classes += ' ' + block + '--selected';
  }

  const isExpanded = expandedSnapshotIds.contains(snapshot.get('id'));

  return (
    <div>
      <div className={classes}
           onClick={() => {
             if (selectedSnapshotId === snapshot.get('id')) {
               clearSelectedSnapshotId();
             } else {
               setSelectedSnapshotId(snapshot.get('id'));
             }
           }}
           onMouseEnter={() => setHighlightedEntityId(snapshot.get('id'))}
           onMouseLeave={clearHighlightedEntityId}>
        <Icon type={isExpanded ? 'close' : 'open'}
              className={block + '__toggle'}
              onClick={e => {
                e.stopPropagation();
                toggleExpandedSnapshotId(snapshot.get('id'));
              }}/>

        <span className={block + '__label'}
              style={{
                color: groupsColorPool.getColorHex(snapshot.get('id'))
              }}>
          {getLabel(snapshot)}
        </span>

        <span className={block + '__child-count'}>
          ({structure.get('children').size})
        </span>
      </div>

      {isExpanded ?
        <ChildList Component={Entry}
                   children={structure.get('children').toArray()}
                   highlightedSnapshotId={highlightedSnapshotId}
                   selectedSnapshotId={selectedSnapshotId}
                   indent={false}
                   root={true}
                   expandedSnapshotIds={expandedSnapshotIds}/>
      : null}
    </div>
  );
}
