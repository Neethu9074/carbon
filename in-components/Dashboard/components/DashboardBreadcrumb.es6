import React from 'react';

import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import {getDashboardLink} from 'in-stores/navigation';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import './DashboardBreadcrumb.less';

const block = 'in-dashboard-breadcrumb';


const Crumb = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId),
    snapshotLink: getDashboardLink(props.snapshotId)
  };
}, function Crumb({snapshot, selectedSnapshotId, snapshotLink}) {
  if (!snapshot) {
    return null;
  }

  const label = getSingular(snapshot.get('plugin'));
  const icon = getIcon(snapshot);
  const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

  let classes = `${block}__crumb`;
  const isSelected = snapshot.get('id') === selectedSnapshotId;
  if (isSelected) {
    classes = `${classes} ${block}__crumb--selected`;
  }

  return (
    <Tooltip content={tooltip}
             align={'bottomMiddle'}>
      <a href={snapshotLink}
         title='Open dashboard for this entity.'
         className={classes}>
        <img src={icon}
             alt='Icon for this type of entity.'
             className={block + '__icon'}/>
        {label}
      </a>
    </Tooltip>
  );
});


export default getPhysicalHierarchy(function DashboardBreadcrumb({physicalHierarchy, snapshotId}) {
  if (physicalHierarchy.size === 0) {
    return null;
  }

  return (
    <ul className={block}>
      {physicalHierarchy.toArray().map(id =>
        <Crumb key={id}
               snapshotId={id}
               selectedSnapshotId={snapshotId} />
      )}
    </ul>
  );
});
