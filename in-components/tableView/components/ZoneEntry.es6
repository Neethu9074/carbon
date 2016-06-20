import React from 'react';

import {
  toggleExpandedSnapshotId,
  expandedSnapshotIds$
} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import {groupsColorPool} from 'in-services/util/ColorGenerator';
import Entry from 'in-components/tableView/components/Entry';
import {getLabel} from 'in-sdk/snapshot';
import {
  highlightedEntityId$,
  setHighlightedEntityId,
  clearHighlightedEntityId
} from 'in-services/stores/highlightedEntityId';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';
import {
  setSelectedSnapshotId,
  clearSelectedSnapshotId,
  selectedSnapshotId$
} from 'in-stores/snapshot';

import './ZoneEntry.less';

const block = 'in-table-view-zone-entry';

export default connectTo(props => {
    const snapshotId = props.snapshot.get('id');
    return {
      isHighlighted: highlightedEntityId$
        .map(highlightedEntityId => highlightedEntityId === snapshotId)
        .distinct(),
      isSelected: selectedSnapshotId$
        .map(selectedSnapshotId => selectedSnapshotId === snapshotId)
        .distinct(),
      isExpanded: expandedSnapshotIds$
        .map(expandedIds => expandedIds.contains(snapshotId))
        .distinct()
    };
  }, function ZoneEntry({snapshot, structure, isHighlighted, isSelected,
      isFilterActive, snapshotIdsMatchingFilter, isExpanded}) {
    let classes = block;

    if (isHighlighted) {
      classes += ' ' + block + '--highlighted';
    }

    if (isSelected) {
      classes += ' ' + block + '--selected';
    }

    return (
      <div>
        <div className={classes}
             onClick={e => {
               if (isSelected) {
                 clearSelectedSnapshotId();
               } else {
                 setSelectedSnapshotId(snapshot.get('id'));
               }
               e.stopPropagation();
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
                     indent={false}
                     root={true}
                     isFilterActive={isFilterActive}
                     snapshotIdsMatchingFilter={snapshotIdsMatchingFilter} />
        : null}
      </div>
    );
  }
);
