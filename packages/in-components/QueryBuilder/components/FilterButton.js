/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { Button } from '@instana/components';

import ConjunctionTagSelectorOverlay from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

export default function FilterButton({
  tagCatalog,
  onAdd,
  formModelIndex,
  renderModelIndex,
  focus,
  trailingButton = false,
  withoutOrConjunction = false,
  withoutBrackets = false,
  fixOverlayLeftAlignment = false,
  getTagCatalog,
  additionalGetTagCatalogProps,
  addTagDefinitionToFormModel
}) {
  // We must not execute the onCloseSideEffect when we just triggered a form model change
  // as this would place the focus onto the wrong element.
  const lastTimeExternalAddToFormModelWasCalledRef = useRef();

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog,
        onChange: addInitialTag,
        withoutOrConjunction,
        withoutBrackets,
        getTagCatalog,
        additionalGetTagCatalogProps,
        addTagDefinitionToFormModel
      }}
      align="bottomLeft"
      withoutWrapper
      fixOverlayLeftAlignment={fixOverlayLeftAlignment}
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
          size="compact"
          icon={trailingButton ? '' : 'lib_openclose_add'}
          kind="tertiary"
          onClick={toggle}
          refSetter={refSetter}
          data-testid="query-builder-add-filter"
        >
          {t('in-components:queryBuilder.components.filterButtonAddFilter')}
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
