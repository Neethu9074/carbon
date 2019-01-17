import React from 'react';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  function TabLabelWithCounter({ label, resultPropName, countersResult }) {
    if (!countersResult || !countersResult[resultPropName]) {
      return <span>{label}</span>;
    }

    return (
      <span>
        {label} ({countersResult[resultPropName]})
      </span>
    );
  }
);
