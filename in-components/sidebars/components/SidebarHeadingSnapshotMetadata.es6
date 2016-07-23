import irpt from 'react-immutable-proptypes';
import React from 'react';

import HealthIconListing from 'in-components/HealthIconListing';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

import './SidebarHeadingSnapshotMetadata.less';


const block = 'in-sidebar-heading-metadata';

export default function SidebarHeadingSnapshotMetadata({snapshot}) {
  if (!snapshot) {
    return null;
  }
  const snapshotId = snapshot.get('id');

  return (
    <div className={block}>
      <h1 className={block + '__label'}>
        {getLabel(snapshot)}
      </h1>

      <div className={block + '__wrapper'}>
        <span className={block + '__plugin-type'}>
          {getSingular(snapshot.get('plugin'))}
        </span>

        <HealthIconListing snapshotId={snapshotId}/>
      </div>
    </div>
  );
}

SidebarHeadingSnapshotMetadata.propTypes = {
  className: React.PropTypes.string,
  snapshot: irpt.map.isRequired
};
