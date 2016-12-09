import {combineLatest} from 'reactive-observables';
import React from 'react';

import DashboardLink from 'in-components/Link/DashboardLink';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Hierarchy.less';


const block = 'in-expand-hierarchy';

export default connectTo(props => {
  return {
    snapshots: combineLatest(props.hierarchy.toArray().map(id => getSnapshot(id)))
  };
},
function Hierarchy({snapshots}) {
  if (!snapshots) {
    return null;
  }

  let imgClasses = `${block}__icon`;

  return (
    <ul className={block}>
      {snapshots.map(snapshot => {
        const icon = getIcon(snapshot);
        return (
          <li key={snapshot.get('id')}
              className={`${block}__item`}>
            <img src={icon}
                 alt='Icon for this type of entity.'
                 className={imgClasses} />
            <DashboardLink snapshotId={snapshot.get('id')}>
              {getLabel(snapshot)}
            </DashboardLink>
          </li>
        );
      })}
    </ul>
  );
});
