/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { toInteractiveElement } from '@instana/components';

import OperatorSelectorOverlay from 'in-new-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import * as operatorLabels from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';

import locals from './Operator.mless';

export default React.forwardRef(function Operator(
  { element: { operator, renderModelIndex }, allowedOperators, tagType, onChange, focus },
  ref
) {
  return (
    <Overlay
      withoutWrapper
      content={OperatorSelectorOverlay}
      props={{ value: operator, onChange, allowedOperators, tagType }}
      align="bottomMiddle"
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <div
          {...toInteractiveElement({
            onDefaultInteraction: () => toggle()
          })}
          className={locals.operator}
          ref={compositeRef(refSetter, ref)}
        >
          {operatorLabels[`${tagType}_${operator}`]}
        </div>
      )}
    </Overlay>
  );
});
