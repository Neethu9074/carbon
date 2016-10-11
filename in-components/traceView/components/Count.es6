import React from 'react';

import {zeroDecimalPlaces} from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    count: props.count$
  };
}, function TotalTraceCount({count}) {
  if (count == null) {
    return null;
  }

  return (
    <span>
      &nbsp;({zeroDecimalPlaces(count)})
    </span>
  );
});
