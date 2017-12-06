import { combineLatest } from 'reactive-observables';
import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Hierarchy.less';

const block = 'in-expand-hierarchy';

export default connectTo(
  props => {
    return {
      snapshots: props.hierarchySnapshots
        ? always(props.hierarchySnapshots)
        : combineLatest(props.hierarchy.toArray().map(id => getSnapshot(id)))
    };
  },
  function Hierarchy({ snapshots, useSnapshotLink, kind }) {
    if (!snapshots) {
      return null;
    }

    return (
      <ul className={block}>
        {snapshots.map(snapshot => {
          return (
            <li key={snapshot.get('id')} className={`${block}__item`}>
              <HierarchicalLink snapshot={snapshot} kind={kind} useSnapshotLink={useSnapshotLink} />
            </li>
          );
        })}
      </ul>
    );
  }
);
