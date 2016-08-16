import React from 'react';

import {getTraceViewFilteredBySnapshotLink} from 'in-stores/navigation/search';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './JumpToTracesButton.less';

const block = 'in-jump-to-traces';

export default connectTo(props => {
  return {
    href: getTraceViewFilteredBySnapshotLink(props.snapshotId)
      .nextFrame()
  };
}, function JumpToTracesButton({href}) {
  return (
    <Tooltip content='Jump to traces starting at this service'>
      <Button href={href}
              className={block}
              kind='secondary'>
        Traces
      </Button>
    </Tooltip>
  );
});
