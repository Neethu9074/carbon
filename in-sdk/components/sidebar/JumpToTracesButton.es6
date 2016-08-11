import React from 'react';

import {getTraceViewFilteredBySnapshotLink} from 'in-stores/navigation/search';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    href: getTraceViewFilteredBySnapshotLink(props.snapshotId)
  };
}, function JumpToTracesButton({href}) {
  return (
    <Button href={href}
            style={{
              margin: '1rem 0',
              display: 'block'
            }}>
      Traces
    </Button>
  );
});
