import React from 'react';

import ConjunctionOrBracketBehavior from 'in-new-components/QueryBuilder/components/ConjunctionOrBracketBehavior';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Conjunction.mless';

export default function Conjunction(props) {
  const { element, dragAndDropProps } = props;
  const { logicalOperator, valid } = element;

  return (
    <ConjunctionOrBracketBehavior
      element={element}
      value={logicalOperator}
      aria-label="Chosen conjunction. Click to change the conjunction, to select a bracket or to remove the conjunction."
      {...props}
    >
      {({ refSetter, elementProps }) => (
        <div className={locals.draggableWrapper} {...dragAndDropProps}>
          <div
            className={evaluateClassNames({
              [locals.conjunction]: true,
              [locals.invalid]: valid === false
            })}
            ref={refSetter}
            {...elementProps}
          >
            {logicalOperator}
          </div>
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
