import { combineLatest } from 'reactive-observables';
import React from 'react';

import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Hierarchy.less';

const block = 'in-expand-hierarchy';

export default connectTo(
  props => {
    return {
      snapshots: combineLatest(props.hierarchy.toArray().map(id => getSnapshot(id)))
    };
  },
  function Hierarchy({ snapshots, useSnapshotLink, kind }) {
    if (!snapshots) {
      return null;
    }

    const imgClasses = `${block}__icon`;

    return (
      <ul className={block}>
        {snapshots.map(snapshot => {
          return (
            <li key={snapshot.get('id')} className={`${block}__item`}>
              <HealthyPluginIcon
                className={imgClasses}
                snapshot={snapshot}
                fallbackColor={kind === 'dark' ? '#000' : '#fff'}
                dimension={12}
              />
              <HierarchicalLink snapshotId={snapshot.get('id')} kind={kind} useSnapshotLink={useSnapshotLink}>
                {getLabel(snapshot)}
              </HierarchicalLink>
            </li>
          );
        })}
      </ul>
    );
  }
);
