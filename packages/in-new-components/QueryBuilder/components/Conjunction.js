/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import ConjunctionOrBracketBehavior from 'in-new-components/QueryBuilder/components/ConjunctionOrBracketBehavior';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Conjunction.mless';

export default function Conjunction(props) {
  const { element, renderModelIndex, dragAndDropProps } = props;
  const { logicalOperator, valid } = element;
  const locals = useThemedLocals(styleDefs);

  return (
    <ConjunctionOrBracketBehavior
      element={element}
      value={logicalOperator}
      aria-label="Chosen conjunction. Click to change the conjunction, to select a bracket or to remove the conjunction."
      {...props}
    >
      {({ refSetter, elementProps }) => (
        <div className={locals.draggableWrapper} data-render-model-index={renderModelIndex} {...dragAndDropProps}>
          <div
            className={classNames({
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
