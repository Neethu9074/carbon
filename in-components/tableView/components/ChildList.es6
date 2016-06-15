import {combineLatest} from 'reactive-observables';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

import './ChildList.less';

const block = 'in-table-view-child-list';

// sort first by plugin and then by label
const snapshotComparatorByPluginAndLabel = (a, b) => {
  const pluginResult = getSingular(a.snapshot.get('plugin'))
    .localeCompare(getSingular(b.snapshot.get('plugin')));
  if (pluginResult !== 0) {
    return pluginResult;
  }

  return getLabel(a.snapshot).localeCompare(getLabel(b.snapshot));
};


const snapshotComparatorByLabel = (a, b) => {
  return getLabel(a.snapshot).localeCompare(getLabel(b.snapshot));
};


export default connectTo(props => {
    const childrenObservables = props.children.map(child => {
      return getSnapshot(child.get('id'))
        .map(snapshot => {
          return {
            structure: child,
            snapshot
          };
        });
    });

    const filledChildren = combineLatest(childrenObservables)
      .map(children => {
        let comparator = snapshotComparatorByPluginAndLabel;
        if (props.ignorePluginWhileSorting) {
          comparator = snapshotComparatorByLabel;
        }
        children.sort(comparator, 'en-US', {
          sensitivity: 'base'
        });
        return children;
      });

    return {
      filledChildren
    };
  }, function ChildList({filledChildren, Component, highlightedSnapshotId, selectedSnapshotId,
      indent, root, expandedSnapshotIds}) {
    if (!filledChildren) {
      return <LoadingIndicator />;
    } else if (filledChildren.length === 0) {
      return null;
    }

    let classes = block;

    if (indent !== false) {
      classes += ' ' + block + '--indented';
    }

    if (root) {
      classes += ' ' + block + '--root';
    }

    return (
      <div className={classes}>
        {filledChildren.map((child, i) =>
          <Component snapshot={child.snapshot}
                     structure={child.structure}
                     key={child.snapshot.get('id')}
                     highlightedSnapshotId={highlightedSnapshotId}
                     selectedSnapshotId={selectedSnapshotId}
                     firstChild={root === true && i === 0}
                     root={root}
                     expandedSnapshotIds={expandedSnapshotIds}/>
        )}
      </div>
    );
  }
);
