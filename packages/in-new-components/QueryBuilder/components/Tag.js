import React from 'react';

import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';

import locals from './Tag.mless';

export default function Tag({
  renderModelIndex,
  formModelIndex,
  onRemove,
  name,
  operator,
  stringValue,
  numberValue,
  booleanValue
}) {
  return (
    <div
      className={locals.tag}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
    >
      {name} {operator} {stringValue ?? numberValue ?? booleanValue}
    </div>
  );
}
