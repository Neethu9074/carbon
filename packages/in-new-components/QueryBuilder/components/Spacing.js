import React from 'react';

import { LETTER, WORD } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import keyCodes from 'in-components/keyCodes';

import locals from './Spacing.mless';

export default function Spacing({ renderModelIndex, size, onRemove, leftFormModelIndex, rightFormModelIndex }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.letter]: size === LETTER.size,
        [locals.word]: size === WORD.size
      })}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={onKeyUp}
    >
      &nbsp;
    </div>
  );

  function onKeyUp(e) {
    if (!onRemove) {
      return;
    }

    if (e.keyCode === keyCodes.backspace) {
      stopPropagationAndPreventDefault(e);
      // Deleting a single element also deletes the whitespace element.
      onRemove(leftFormModelIndex, renderModelIndex - 2);
    } else if (e.keyCode === keyCodes.delete) {
      stopPropagationAndPreventDefault(e);
      onRemove(rightFormModelIndex, renderModelIndex);
    }
  }
}
