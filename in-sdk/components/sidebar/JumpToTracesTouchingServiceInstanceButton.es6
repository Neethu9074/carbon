import React from 'react';

import {getTraceViewFilteredByTouchingLink} from 'in-stores/navigation/search';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import {getNumberOfTracesTouchingServiceInstance} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    href: getTraceViewFilteredByTouchingLink(props.snapshotId)
      .nextFrame(),
    traceCount: getNumberOfTracesTouchingServiceInstance(props.snapshotId)
  };
}, function JumpToTracesTouchingServiceInstanceButton({href, traceCount}) {
  return (
    <JumpToTracesButton href={href}
                        traceCount={traceCount}
                        title='Traces Touching'
                        tooltip='Jump to traces touching this service instance' />
  );
});
