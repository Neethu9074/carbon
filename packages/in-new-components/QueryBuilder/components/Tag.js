import React from 'react';

import OperatorSelectorOverlay from 'in-new-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import { createTagFilter } from 'in-new-components/QueryBuilder/transformation/formModel';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Tag.mless';

export default function Tag(props) {
  const { renderModelIndex, formModelIndex, onRemove, onChange: onChangeInFormModel } = props;

  return (
    <div
      className={locals.tag}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
    >
      <Key {...props} />
      <Operator operator={props.operator} onChange={onChange} />
      <Value {...props} />
      <RemoveIcon {...props} />
    </div>
  );

  function onChange(newOperator) {
    onChangeInFormModel({
      ...createTagFilter(props),
      operator: newOperator
    });
  }
}

function RemoveIcon({ renderModelIndex, formModelIndex, onRemove }) {
  return (
    <SvgIcon
      className={locals.icon}
      type="lib_openclose_cancel"
      tabIndex={-1}
      onClick={() => onRemove(formModelIndex, renderModelIndex - 1)}
    />
  );
}

function Key({ name }) {
  return name;
}

function Operator({ operator, renderModelIndex, onChange }) {
  return (
    <Overlay
      withoutWrapper
      align="bottomMiddle"
      content={OperatorSelectorOverlay}
      props={{ value: operator, onChange }}
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <span className={locals.operator} onClick={toggle} ref={refSetter}>
          {operator}
        </span>
      )}
    </Overlay>
  );
}

function Value({ stringValue, numberValue, booleanValue }) {
  return <>{stringValue ?? numberValue ?? booleanValue}</>;
}
