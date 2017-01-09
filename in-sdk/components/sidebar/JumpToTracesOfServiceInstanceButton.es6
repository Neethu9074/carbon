import React from 'react';

import {getTraceViewFilteredByServiceInstanceStartingAtLink} from 'in-stores/navigation/search';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import {getNumberOfTracesStartingAtServiceInstance} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    href: getTraceViewFilteredByServiceInstanceStartingAtLink(props.snapshotId)
      .nextFrame(),
    traceCount: getNumberOfTracesStartingAtServiceInstance(props.snapshotId)
  };
}, function JumpToTracesOfServiceInstanceButton({href, traceCount}) {
  return (
    <JumpToTracesButton href={href}
                        traceCount={traceCount}
                        title='Traces Starting Here'
                        tooltip='Jump to traces starting at this service instance' />
  );
});
