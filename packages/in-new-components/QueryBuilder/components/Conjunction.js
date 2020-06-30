import React from 'react';

import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';

import locals from './Conjunction.mless';

export default function Conjunction({ renderModelIndex, logicalOperator, formModelIndex, onRemove }) {
  return (
    <div
      className={locals.conjunction}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
    >
      {logicalOperator}
    </div>
  );
}
