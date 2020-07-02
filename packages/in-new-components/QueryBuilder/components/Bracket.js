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
  const { type, valid } = props;
  return (
    <ConjunctionOrBracketBehavior
      {...props}
      value={type === OPEN_BRACKET ? openBracket : closeBracket}
      aria-label="Chosen bracket. Click to change the bracket, to select a conjunction or to remove the bracket."
    >
      {({ refSetter, elementProps }) => (
        <div
          ref={refSetter}
          {...elementProps}
          className={evaluateClassNames({
            [locals.bracket]: true,
            [locals.invalid]: valid === false
          })}
        >
          {type === OPEN_BRACKET ? '(' : ')'}
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
