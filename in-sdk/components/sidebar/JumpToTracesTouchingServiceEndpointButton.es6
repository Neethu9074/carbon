import React from 'react';

import { getTraceViewFilteredByServiceEndpointStartingAtLink } from 'in-stores/navigation/search';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './JumpToTracesTouchingServiceEndpointButton.less';

const block = 'in-jump-to-service-endpoint-button';

export default connectTo(
  props => {
    return {
      href: getTraceViewFilteredByServiceEndpointStartingAtLink(props.snapshotId, props.label)
    };
  },
  function JumpToTracesTouchingServiceButton({ href }) {
    return (
      <Tooltip content="Jump to traces touching this service endpoint">
        <Button href={href} kind="secondary" size="sm" className={block}>
          Traces Touching
        </Button>
      </Tooltip>
    );
  }
);
