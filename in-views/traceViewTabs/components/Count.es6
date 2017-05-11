import React from 'react';

import connectTo from 'in-hoc/connectTo';
import { number } from 'in-services/formatters/number';

export default connectTo(
  props => {
    return {
      count: props.count$
    };
  },
  function TotalTraceCount({ count }) {
    if (count == null || count < 0) {
      return null;
    }

    return <span>{`(${number.compact(count)})`}</span>;
  }
);
