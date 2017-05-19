import React from 'react';

import { getTraceViewFilteredByServiceEndpointStartingAtLink } from 'in-stores/navigation/search';
import { getNumberOfTracesTouchingServiceEndpoint } from 'in-stores/traces';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      href: getTraceViewFilteredByServiceEndpointStartingAtLink(props.snapshotId, props.label),
      count: getNumberOfTracesTouchingServiceEndpoint(props.snapshotId, props.label)
    };
  },
  function JumpToTracesTouchingServiceButton({ href, count }) {
    return (
      <Tooltip content="Jump to traces touching this service endpoint">
        <Button href={href} kind="secondary" size="sm">
          Traces Touching ({zeroDecimalPlaces(count)})
        </Button>
      </Tooltip>
    );
  }
);
