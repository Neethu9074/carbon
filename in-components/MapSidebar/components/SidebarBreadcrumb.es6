import React from 'react';

import {getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import './SidebarBreadcrumb.less';

const block = 'in-sidebar-breadcrumb';
const crumbElement = `${block}__crumb`;

const Crumb = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId),
    snapshotLink: getLinkToSnapshotInCurrentView(props.snapshotId)
  };
}, function Crumb({snapshot, selectedSnapshotId, snapshotLink}) {
  if (!snapshot) {
    return null;
  }

  const icon = getIcon(snapshot);
  const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

  let imgClasses = `${crumbElement}-icon`;
  const isSelected = snapshot.get('id') === selectedSnapshotId;
  if (isSelected) {
    imgClasses = `${imgClasses} ${crumbElement}-icon--selected`;
  }

  return (
    <Tooltip content={tooltip}
             align='rightMiddle'>
      <li className={crumbElement}>
        <a href={snapshotLink}
           title='Select this entity.'
           className={`${crumbElement}-link`}>
          <img src={icon}
               alt='Icon for this type of entity.'
               className={imgClasses} />
        </a>
      </li>
    </Tooltip>
  );
});


export default getPhysicalHierarchy(function SidebarBreadcrumb({physicalHierarchy, snapshotId}) {
  if (physicalHierarchy.size <= 1) {
    return null;
  }

  physicalHierarchy = physicalHierarchy.toArray();

  return (
    <ul className={block}>
      {physicalHierarchy.map(id =>
        <Crumb key={id}
               snapshotId={id}
               selectedSnapshotId={snapshotId} />
      )}
    </ul>
  );
});
