import React from 'react';

import {
  toggleExpandedSnapshotId,
  expandedSnapshotIds$
} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import {getLabel, getIcon} from 'in-sdk/snapshot';
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

import './Entry.less';

const block = 'in-table-view-entry';

// deliberately giving it a name and assigning it to a variable to support recursive
// references
const Entry = connectTo(props => {
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
  }, function EntryComponent({snapshot, structure, isHighlighted, isSelected,
      isFilterActive, snapshotIdsMatchingFilter, isExpanded, firstChild, root}) {
    let classes = block;

    if (isHighlighted) {
      classes += ' ' + block + '--highlighted';
    }

    if (isSelected) {
      classes += ' ' + block + '--selected';
    }

    if (firstChild) {
      classes += ' ' + block + '--first-child';
    }

    if (root) {
      classes += ' ' + block + '--root';
    }

    const hasChildren = structure.get('children').size > 0;

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

          <AnnotatedHealthBar snapshotId={snapshot.get('id')}
                              className={block + '__health'} />
        </div>

        {hasChildren && isExpanded ?
          <ChildList Component={Entry}
                     children={structure.get('children').toArray()}
                     indent={true}
                     isFilterActive={isFilterActive}
                     snapshotIdsMatchingFilter={snapshotIdsMatchingFilter} />
        : null}
      </div>
    );
  }
);

export default Entry;
