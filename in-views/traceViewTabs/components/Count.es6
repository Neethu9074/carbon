import React from 'react';

import connectTo from 'in-hoc/connectTo';
import { number } from 'in-services/formatters/number';

export default connectTo(
  props => {
    return {
      countResult: props.count$
    };
  },
  function TotalTraceCount({ countResult }) {
    if (countResult == null || countResult.get('count') < 0) {
      return null;
    }

    if (countResult.get('determinedEarly') || countResult.get('timedOut')) {
      return <span>{`>(${number.compact(countResult.get('count'))})`}</span>;
    }

    return <span>{`(${number.compact(countResult.get('count'))})`}</span>;
  }
);
