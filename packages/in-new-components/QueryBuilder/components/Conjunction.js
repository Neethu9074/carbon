import React from 'react';

import ConjunctionOrBracketBehavior from 'in-new-components/QueryBuilder/components/ConjunctionOrBracketBehavior';

import locals from './Conjunction.mless';

export default function Conjunction(props) {
  const { logicalOperator } = props;
  return (
    <ConjunctionOrBracketBehavior
      {...props}
      value={logicalOperator}
      aria-label="Chosen conjunction. Click to change the conjunction, to select a bracket or to remove the conjunction."
    >
      {({ refSetter, elementProps }) => (
        <div ref={refSetter} {...elementProps} className={locals.conjunction}>
          {logicalOperator}
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
