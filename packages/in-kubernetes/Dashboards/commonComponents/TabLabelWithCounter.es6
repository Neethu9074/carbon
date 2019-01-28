import React from 'react';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  function TabLabelWithCounter({ label, resultPropName, countersResult }) {
    if (!countersResult || !countersResult.data || countersResult.data[resultPropName] === undefined) {
      return <span>{label}</span>;
    }

    return (
      <span>
        {label} ({countersResult.data[resultPropName]})
      </span>
    );
  }
);
