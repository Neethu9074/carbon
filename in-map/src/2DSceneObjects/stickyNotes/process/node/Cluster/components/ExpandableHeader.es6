import React from 'react';

import ExpandIcon from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/ExpandIcon';
import {getLabel} from 'in-sdk/snapshot';

import './ExpandableHeader.less';


const block = 'in-sticky-note-process-cluster-header';

export default function ExpandableHeader({expanded, highlighted, snapshot, numItems, onClick, isHighlighted}) {
  let className = block;
  if (highlighted || expanded) {
    className += ' ' + className + '--highlighted';
  }

  if (numItems > 0) {
    return (
      <div className={className}
           onMouseEnter={() => isHighlighted(true)}
           onMouseLeave={() => isHighlighted(false)}
           onClick={onClick}>
        {getLabel(snapshot) + ' (' + numItems + ')'}
        <ExpandIcon expanded={expanded} />
      </div>
    );
  }

  return (
    <div className={block}>
      {getLabel(snapshot)}
    </div>
  );
}
