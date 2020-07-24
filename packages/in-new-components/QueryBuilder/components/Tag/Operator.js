import React from 'react';

import OperatorSelectorOverlay from 'in-new-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import * as operatorLabels from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import Overlay from 'in-new-components/overlays/Overlay';

import locals from './Operator.mless';

export default function Operator({ element: { operator, renderModelIndex }, allowedOperators, tagType, onChange }) {
  return (
    <Overlay
      withoutWrapper
      content={OperatorSelectorOverlay}
      props={{ value: operator, onChange, allowedOperators, tagType }}
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <span className={locals.operator} onClick={toggle} ref={refSetter}>
          {operatorLabels[`${tagType}_${operator}`]}
        </span>
      )}
    </Overlay>
  );
}
