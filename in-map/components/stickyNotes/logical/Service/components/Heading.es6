import React from 'react';

import ExpandIcon from 'in-map/components/stickyNotes/logical/Service/components/ExpandIcon';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/logical/Service/components/Heading.less';


const block = 'in-sticky-note-service-heading';

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId)
  };
},
function Icon({children, snapshot, highlighted, expanded, onHighlight, onClick}) {
  if (!snapshot) {
    return null;
  }

  const childrenAreAvailable = children && children.size > 0;

  let headerClassName = block;
  if (highlighted || expanded) {
    headerClassName += ' ' + headerClassName + '--highlighted';
  }

  return childrenAreAvailable
    ? (
      <div className={headerClassName}
           onMouseEnter={() => onHighlight(true)}
           onMouseLeave={() => onHighlight(false)}
           onClick={onClick}>
        {getLabel(snapshot) + ' (' + children.size + ')'}
        <ExpandIcon expanded={expanded} />
      </div>
    )
    : (
      <div className={headerClassName}>
        {getLabel(snapshot)}
      </div>
    );
});
