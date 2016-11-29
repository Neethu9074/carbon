import React from 'react';

import {alwaysNull} from 'in-services/fixedStreams';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import {getZone} from 'in-stores/zone';

import './EntityColumnContent.less';

const block = 'in-trace-view-entity-column';

export default connectTo(props => {
  return {
    snapshot: getZone(props.serviceInstanceSnapshotId)
      .flatMap(serviceSnapshotId => serviceSnapshotId ? getSnapshot(serviceSnapshotId) : alwaysNull)
  };
}, function EntityColumnContent({snapshot}) {
  if (!snapshot) {
    return null;
  }
  const entityType = getSingular(snapshot.get('plugin'));
  const label = getLabel(snapshot);
  return (
    <Tooltip content={label}
             align='rightMiddle'>
      <div className={block}>
        <img src={getIcon(snapshot)}
             alt={`Icon for entities of type ${entityType}`}
             className={`${block}__icon`} />
        <span>
          {label}
        </span>
      </div>
    </Tooltip>
  );
});
