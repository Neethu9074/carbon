import React from 'react';

import {
  openBracket,
  closeBracket
} from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import ConjunctionOrBracketBehavior from 'in-new-components/QueryBuilder/components/ConjunctionOrBracketBehavior';
import { OPEN_BRACKET } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Bracket.mless';

export default function Bracket(props) {
  const { element, dragAndDropProps } = props;

  return (
    <ConjunctionOrBracketBehavior
      element={element}
      value={element.type === OPEN_BRACKET ? openBracket : closeBracket}
      aria-label="Chosen bracket. Click to change the bracket, to select a conjunction or to remove the bracket."
      {...props}
    >
      {({ refSetter, elementProps }) => (
        <div className={locals.draggableWrapper} {...dragAndDropProps}>
          <div
            ref={refSetter}
            {...elementProps}
            className={evaluateClassNames({
              [locals.bracket]: true,
              [locals.invalid]: element.valid === false
            })}
          >
            {element.type === OPEN_BRACKET ? '(' : ')'}
          </div>
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
