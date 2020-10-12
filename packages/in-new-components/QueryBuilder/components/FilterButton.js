import React, { useRef } from 'react';

import ConjunctionTagSelectorOverlay from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import evaluateClassNames from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';

import locals from './FilterButton.mless';

export default function FilterButton({
  tagCatalog,
  onAdd,
  formModelIndex,
  renderModelIndex,
  focus,
  trailingButton = false
}) {
  // We must not execute the onCloseSideEffect when we just triggered a form model change
  // as this would place the focus onto the wrong element.
  const lastTimeExternalAddToFormModelWasCalledRef = useRef();

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog: tagCatalog,
        onChange: addInitialTag
      }}
      align="bottomLeft"
      withoutWrapper
      onCloseSideEffect={() => {
        if (
          lastTimeExternalAddToFormModelWasCalledRef.current == null ||
          lastTimeExternalAddToFormModelWasCalledRef.current < Date.now() - 500
        ) {
          focus(renderModelIndex);
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <Button
          className={evaluateClassNames({
            [locals.button]: true,
            [locals.trailingButton]: trailingButton
          })}
          size="compact"
          icon={trailingButton ? '' : 'lib_openclose_add'}
          kind="subtle"
          onClick={toggle}
          refSetter={refSetter}
        >
          Add filter
        </Button>
      )}
    </Overlay>
  );

  function addInitialTag(opts) {
    lastTimeExternalAddToFormModelWasCalledRef.current = Date.now();
    onAdd({
      formModelIndex,
      renderModelIndex,
      newFormModel: opts
    });
  }
}
