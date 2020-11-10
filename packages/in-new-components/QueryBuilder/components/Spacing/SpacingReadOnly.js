import React from 'react';

import { LETTER, WORD } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Spacing.mless';

export default function SpacingReadOnly({ element: { size } }) {
  return (
    <div
      style={{ cursor: 'not-allowed' }}
      className={evaluateClassNames({
        [locals.letter]: size === LETTER.size,
        [locals.word]: size === WORD.size
      })}
    />
  );
}
