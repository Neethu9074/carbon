import {combineLatest} from 'reactive-observables';
import React from 'react';

import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
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

  const imgClasses = `${block}__icon`;

  return (
    <ul className={block}>
      {snapshots.map(snapshot => {
        return (
          <li key={snapshot.get('id')}
              className={`${block}__item`}>
            <HealthyPluginIcon className={imgClasses}
                               snapshot={snapshot}
                               fallbackColor='#000' />
            <DashboardLink snapshotId={snapshot.get('id')}>
              {getLabel(snapshot)}
            </DashboardLink>
          </li>
        );
      })}
    </ul>
  );
});
