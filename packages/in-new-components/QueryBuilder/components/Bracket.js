import React from 'react';

import { OPEN_BRACKET } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';

import locals from './Bracket.mless';

export default function Bracket({ renderModelIndex, formModelIndex, onRemove, type }) {
  return (
    <div
      className={locals.bracket}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
    >
      {type === OPEN_BRACKET ? '(' : ')'}
    </div>
  );
}
