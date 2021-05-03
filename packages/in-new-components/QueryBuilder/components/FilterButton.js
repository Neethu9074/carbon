/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { Button } from '@instana/components';

import ConjunctionTagSelectorOverlay from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './FilterButton.mless';

export default function FilterButton({
  tagCatalog,
  onAdd,
  formModelIndex,
  renderModelIndex,
  focus,
  trailingButton = false,
  withoutOrConjunction = false,
  withoutBrackets = false
}) {
  // We must not execute the onCloseSideEffect when we just triggered a form model change
  // as this would place the focus onto the wrong element.
  const lastTimeExternalAddToFormModelWasCalledRef = useRef();

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog: tagCatalog,
        onChange: addInitialTag,
        withoutOrConjunction: withoutOrConjunction,
        withoutBrackets: withoutBrackets
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
          className={locals.button}
          size="compact"
          icon={trailingButton ? '' : 'lib_openclose_add'}
          kind="subtle"
          onClick={toggle}
          refSetter={refSetter}
        >
          {t('in-new-components:queryBuilder.components.filterButtonAddFilter')}
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
