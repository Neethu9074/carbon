import React from 'react';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {toggleExpandedSnapshotId} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import HealthBar from 'in-components/HealthBar';
import Icon from 'in-components/Icon';

import './Entry.less';

const block = 'in-table-view-entry';

export default function Entry({snapshot, structure, highlightedSnapshotId, selectedSnapshotId,
    firstChild, root, expandedSnapshotIds, isFilterActive, snapshotIdsMatchingFilter}) {
  let classes = block;

  if (highlightedSnapshotId === snapshot.get('id')) {
    classes += ' ' + block + '--highlighted';
  }

  if (selectedSnapshotId === snapshot.get('id')) {
    classes += ' ' + block + '--selected';
  }

  if (firstChild) {
    classes += ' ' + block + '--first-child';
  }

  if (root) {
    classes += ' ' + block + '--root';
  }

  const hasChildren = structure.get('children').size > 0;
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
              style={{
                visibility: hasChildren ? 'visible' : 'hidden'
              }}
              onClick={e => {
                e.stopPropagation();
                toggleExpandedSnapshotId(snapshot.get('id'));
              }}/>

        <img src={getIcon(snapshot)}
             alt='Icon depicting this type of plugin.'
             className={block + '__icon'} />

        <span className={block + '__label'}>
          {getLabel(snapshot)}
        </span>

        <HealthBar snapshotId={snapshot.get('id')}
                   className={block + '__health'} />
      </div>

      {hasChildren && isExpanded ?
        <ChildList Component={Entry}
                   children={structure.get('children').toArray()}
                   highlightedSnapshotId={highlightedSnapshotId}
                   selectedSnapshotId={selectedSnapshotId}
                   indent={true}
                   expandedSnapshotIds={expandedSnapshotIds}
                   isFilterActive={isFilterActive}
                   snapshotIdsMatchingFilter={snapshotIdsMatchingFilter} />
      : null}
    </div>
  );
}
