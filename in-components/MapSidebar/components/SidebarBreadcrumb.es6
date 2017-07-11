import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './SidebarBreadcrumb.less';

const block = 'in-sidebar-breadcrumb';
const crumbElement = `${block}__crumb`;

const Crumb = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function Crumb({ snapshot, selectedSnapshotId, snapshotId }) {
    if (!snapshot) {
      return null;
    }

    const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

    let imgClasses = `${crumbElement}-icon`;
    const isSelected = snapshot.get('id') === selectedSnapshotId;
    if (isSelected) {
      imgClasses = `${imgClasses} ${crumbElement}-icon--selected`;
    }

    return (
      <Tooltip content={tooltip} align="rightMiddle">
        <li className={crumbElement}>
          <Link
            href$={getLinkToSnapshotInCurrentView(snapshotId)}
            title="Select this entity."
            className={`${crumbElement}-link`}
          >
            <HealthyPluginIcon className={imgClasses} snapshot={snapshot} />
          </Link>
        </li>
      </Tooltip>
    );
  }
);

export default getPhysicalHierarchy(function SidebarBreadcrumb({ physicalHierarchy, snapshotId }) {
  if (physicalHierarchy.size <= 1) {
    return null;
  }

  physicalHierarchy = physicalHierarchy.toArray();

  return (
    <ul className={block}>
      {physicalHierarchy.map(id => <Crumb key={id} snapshotId={id} selectedSnapshotId={snapshotId} />)}
    </ul>
  );
});
