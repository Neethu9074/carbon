import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import {getSnapshot} from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './EntityColumnContent.less';


const block = 'in-trace-view-entity-column';

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.serviceSnapshotId, props.time)
  };
}, function EntityColumnContent({snapshot}) {
  if (!snapshot) {
    return null;
  }
  const label = getLabel(snapshot);
  return (
    <Tooltip content={label}
             align='rightMiddle'>
      <div className={block}>
        <PluginIcon className={`${block}__icon`}
                    dimension={14}
                    color='#000'
                    snapshot={snapshot} />
        <span>
          {label}
        </span>
      </div>
    </Tooltip>
  );
});
