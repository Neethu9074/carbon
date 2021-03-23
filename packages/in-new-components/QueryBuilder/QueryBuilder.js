/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';
import rpt from 'prop-types';

import {
  toRenderModel,
  SPACING,
  TAG,
  CONJUNCTION,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  EXPRESSION
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import QueryBuilderDragAndDropBehaviour from 'in-new-components/QueryBuilder/QueryBuilderDragAndDropBehaviour';
import { onKeyDown, onClickQueryBuilderContent } from 'in-new-components/QueryBuilder/keyboardInteraction';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import DragAndDropBehaviour from 'in-new-components/QueryBuilder/DragAndDropBehaviour';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import QueryBuilderReadOnly from 'in-new-components/QueryBuilder/QueryBuilderReadOnly';
import { isFormModelValid } from 'in-new-components/QueryBuilder/validation/formModel';
import { createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import FilterButton from 'in-new-components/QueryBuilder/components/FilterButton';
import Conjunction from 'in-new-components/QueryBuilder/components/Conjunction';
import Spacing from 'in-new-components/QueryBuilder/components/Spacing/Spacing';
import Expression from 'in-new-components/QueryBuilder/components/Expression';
import Bracket from 'in-new-components/QueryBuilder/components/Bracket';
import Tag from 'in-new-components/QueryBuilder/components/Tag/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './QueryBuilder.mless';

const componentMapping = {
  [SPACING]: Spacing,
  [TAG]: Tag,
  [CONJUNCTION]: Conjunction,
  [EXPRESSION]: Expression,
  [OPEN_BRACKET]: Bracket,
  [CLOSE_BRACKET]: Bracket
};

export default function QueryBuilderErrorBoundry({ readOnly, ...props }) {
  return (
    <ErrorBoundary name="QueryBuilder">
      {readOnly ? <QueryBuilderReadOnly {...props} /> : <QueryBuilder {...props} />}
    </ErrorBoundary>
  );
}

function QueryBuilder({
  value: formModel,
  getTagCatalog,
  getSuggestions,
  getSuggestionsProps,
  onChange: onValidChange,
  onError,
  tracking,
  withoutOrConjunction = false,
  withoutBrackets = false,
  useLastValidStateWhenErroneous = false,
  autoFocusInput = false,
  getSuggestionLabel
}) {
  const timeConfig = useTimeConfig();
  const [draggedFormModelIndex$] = useState(create());
  const tagCatalog = useObservable(getTagCatalogObservable, [getTagCatalog, timeConfig]);
  const resolvedCreateTagForm = tagCatalog?.data && createTagForm.bind(null, tagCatalog);

  // Keep the fromMode state internally and notify the parent only about valid changes
  const [currentFormModel, setCurrentFormModel] = useState(formModel);
  const onChange = formModel => {
    setCurrentFormModel(formModel);
    if (
      !useLastValidStateWhenErroneous ||
      (tagCatalog?.data && isFormModelValid({ tagCatalog: tagCatalog.data, formModel: formModel }))
    ) {
      tracking?.onQueryChanged?.(formModel);
      onValidChange(formModel);
    } else {
      onError(true);
    }
  };

  useEffect(() => {
    // formModel changes from props should always override the internal state
    setCurrentFormModel(formModel);
  }, [formModel]);

  const refContainer = useRef();
  // To allow re-rendering when no React state has changed. We use this when we change the
  // postUpdateFocus ref in order to force React to re-execute the hooks. Updating a ref
  // does not cause a re-render hence this workaround.
  const forceRerender = useState()[1];
  const postUpdateFocus = useRef();
  useLayoutEffect(() => {
    const index = postUpdateFocus.current?.index;
    if (index != null && refContainer.current) {
      const focusableElements = refContainer.current.querySelectorAll(`[data-render-model-index]`);
      const nextFocusIndex = Math.max(0, Math.min(index, focusableElements.length - 1));
      let nextFocusElement = focusableElements[nextFocusIndex];
      if (nextFocusElement) {
        const childElementSelector = postUpdateFocus.current?.childElementSelector;
        if (childElementSelector) {
          nextFocusElement = nextFocusElement.querySelector(childElementSelector) || nextFocusElement;
        }
        nextFocusElement.focus();
      }
    }
  }, [postUpdateFocus.current?.id]);

  if (!tagCatalog?.data) {
    return <LoadingIndicator />;
  }

  const renderModel = toRenderModel(currentFormModel);

  return currentFormModel.length === 0 ? (
    <FilterButton
      tagCatalog={tagCatalog.data}
      onAdd={onAddFormModelElement}
      formModelIndex={0}
      renderModelIndex={0}
      focus={focus}
      withoutOrConjunction={withoutOrConjunction}
      withoutBrackets={withoutBrackets}
    />
  ) : (
    <>
      <QueryBuilderDragAndDropBehaviour
        queryBuilderRef={refContainer}
        totalItems={currentFormModel.length}
        switchFormModelIndices={switchFormModelIndices}
        setDraggedFormModelIndex={index => draggedFormModelIndex$.emit(index)}
      >
        {({ dragAndDropProps }) => (
          <div
            ref={refContainer}
            className={locals.queryBuilder}
            onClick={e => onClickQueryBuilderContent(e, refContainer.current)}
            onKeyDown={e => onKeyDown(e, refContainer.current)}
            {...dragAndDropProps}
          >
            <Elements
              draggedFormModelIndex$={draggedFormModelIndex$}
              switchFormModelIndices={switchFormModelIndices}
              createTagForm={resolvedCreateTagForm}
              onChange={onChangeFormModelElement}
              getSuggestions={getSuggestions}
              getSuggestionsProps={getSuggestionsProps}
              onAdd={onAddFormModelElement}
              tagCatalog={tagCatalog.data}
              elements={renderModel}
              onRemove={onRemove}
              focus={focus}
              formModel={currentFormModel}
              withoutOrConjunction={withoutOrConjunction}
              withoutBrackets={withoutBrackets}
              autoFocusInput={autoFocusInput}
              getSuggestionLabel={getSuggestionLabel}
            />
          </div>
        )}
      </QueryBuilderDragAndDropBehaviour>
      <FilterButton
        tagCatalog={tagCatalog.data}
        onAdd={onAddFormModelElement}
        formModelIndex={currentFormModel.length}
        renderModelIndex={renderModel.length - 1}
        focus={focus}
        trailingButton
        withoutOrConjunction={withoutOrConjunction}
        withoutBrackets={withoutBrackets}
      />
    </>
  );

  function switchFormModelIndices(indexA, indexB) {
    if (indexA === indexB) {
      return;
    }

    const copiedFormModel = currentFormModel.slice();
    const [tmp] = copiedFormModel.splice(indexA, 1);
    copiedFormModel.splice(indexB, 0, tmp);
    onChange(copiedFormModel);
  }

  function onChangeFormModelElement({ formModelIndex, renderModelIndex, newFormModel, changeFocus }) {
    updateFormModel({ formModelIndex, renderModelIndex, newFormModel, removeTargetItem: true, changeFocus });
  }

  function onAddFormModelElement({ formModelIndex, renderModelIndex, newFormModel }) {
    const updatedFormModel = currentFormModel.slice();
    const addConjunction = shouldAutomaticallyAddAConjunction(updatedFormModel, newFormModel, formModelIndex);
    updatedFormModel.splice(formModelIndex, 0, newFormModel);
    if (addConjunction) {
      updatedFormModel.splice(formModelIndex, 0, {
        logicalOperator: and,
        type: CONJUNCTION
      });
    }

    let nextFocusIndex = renderModelIndex + 1;
    let childSelector;
    if (newFormModel.type === TAG) {
      // Auto-focus the first input element for new tag filters.
      childSelector = 'input';
    } else if (
      newFormModel.type === CONJUNCTION ||
      newFormModel.type === OPEN_BRACKET ||
      newFormModel.type === CLOSE_BRACKET
    ) {
      // No need to focus the conjunction/bracket. They are not configurable so focussing these doesn't
      // provide any additional value. Instead focus the next element to make the addition of new tags easier.
      nextFocusIndex++;
    }

    if (addConjunction) {
      // Skip the automatically added conjunction + the spacing created by it when adding tag filters
      // without the required conjunctions.
      nextFocusIndex += 2;
    }

    focus(
      nextFocusIndex,
      // Forced re-render not necessary because the onChange call down below will also
      // cause a re-render.
      false,
      childSelector
    );

    onChange(updatedFormModel);

    if (newFormModel.type === TAG) {
      tracking?.onTagAdded?.(newFormModel, updatedFormModel);
    }
  }

  function updateFormModel({ formModelIndex, renderModelIndex, newFormModel, removeTargetItem, changeFocus }) {
    const copiedFormModel = currentFormModel.slice();
    copiedFormModel.splice(formModelIndex, removeTargetItem ? 1 : 0, newFormModel);
    if (changeFocus) {
      focus(
        renderModelIndex,
        // Forced re-render not necessary because the onChange call down below will also
        // cause a re-render.
        false
      );
    }
    onChange(copiedFormModel);
    return copiedFormModel;
  }

  function onRemove(formModelIndex, renderModelIndexToFocus, numberOfElementsToRemove = 1) {
    const elementToRemove = currentFormModel[formModelIndex];
    if (!elementToRemove) {
      // this can happen, e.g., when someone presses backspace at the very first position, causing
      // elementToRemove to be undefined.
      return;
    }

    const copiedFormModel = currentFormModel.slice();
    copiedFormModel.splice(formModelIndex, numberOfElementsToRemove);
    focus(
      renderModelIndexToFocus,
      // Forced re-render not necessary because the onChange call down below will also
      // caused a re-render.
      false
    );
    onChange(copiedFormModel);
    if (elementToRemove.type === TAG) {
      tracking?.onTagRemoved?.(elementToRemove, copiedFormModel);
    }
  }

  function focus(renderModelIndex, executeForcedRerender = true, childElementSelector) {
    postUpdateFocus.current = {
      id: Date.now(),
      index: renderModelIndex,
      childElementSelector
    };

    if (executeForcedRerender) {
      forceRerender(Date.now());
    }
  }
}

function Elements({
  elements,
  switchFormModelIndices,
  draggedFormModelIndex$,
  getSuggestions,
  getSuggestionsProps,
  createTagForm,
  tagCatalog,
  onRemove,
  onChange,
  onAdd,
  focus,
  depth = 0,
  formModel,
  withoutOrConjunction,
  withoutBrackets,
  autoFocusInput,
  getSuggestionLabel
}) {
  return (
    <>
      {elements.map((element, i) => {
        const Component = componentMapping[element.type];
        return (
          <DragAndDropBehaviour
            key={i}
            formModelIndex={element.formModelIndex}
            fixDropIndex={element.rightFormModelIndex}
            dragEnabled={element.type !== SPACING}
            switchFormModelIndices={switchFormModelIndices}
            setDraggedFormModelIndex={index => draggedFormModelIndex$.emit(index)}
          >
            {({ dragAndDropProps }) => (
              <Component
                // Also forward element props as "element" in order to avoid problems caused by
                // React's reserved words, e.g. key or ref
                element={element}
                tagCatalog={tagCatalog}
                getSuggestions={getSuggestions}
                getSuggestionsProps={getSuggestionsProps}
                onRemove={onRemove}
                createTagForm={createTagForm}
                onChange={(newFormModel, changeFocus = true) =>
                  onChange({
                    formModelIndex: element.formModelIndex,
                    renderModelIndex: element.renderModelIndex,
                    newFormModel,
                    changeFocus
                  })
                }
                onAdd={newFormModel =>
                  onAdd({
                    formModelIndex: element.formModelIndex || element.rightFormModelIndex,
                    renderModelIndex: element.renderModelIndex,
                    newFormModel
                  })
                }
                focus={focus}
                depth={depth}
                dragAndDropProps={dragAndDropProps}
                draggedFormModelIndex$={draggedFormModelIndex$}
                formModel={formModel}
                withoutOrConjunction={withoutOrConjunction}
                withoutBrackets={withoutBrackets}
                autoFocusInput={autoFocusInput}
                getSuggestionLabel={getSuggestionLabel}
              >
                {element.elements && (
                  <Elements
                    tagCatalog={tagCatalog}
                    draggedFormModelIndex$={draggedFormModelIndex$}
                    switchFormModelIndices={switchFormModelIndices}
                    getSuggestions={getSuggestions}
                    createTagForm={createTagForm}
                    elements={element.elements}
                    onRemove={onRemove}
                    onChange={onChange}
                    onAdd={onAdd}
                    focus={focus}
                    depth={depth + 1}
                    formModel={formModel}
                    withoutOrConjunction={withoutOrConjunction}
                    withoutBrackets={withoutBrackets}
                    autoFocusInput={autoFocusInput}
                    getSuggestionLabel={getSuggestionLabel}
                  />
                )}
              </Component>
            )}
          </DragAndDropBehaviour>
        );
      })}
    </>
  );
}

export const trackingProps = {
  onTagAdded: rpt.func,
  onTagRemoved: rpt.func,
  onQueryChanged: rpt.func
};

QueryBuilder.propTypes = {
  value: rpt.array.isRequired,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  getSuggestionsProps: rpt.object,
  onChange: rpt.func.isRequired,
  onError: rpt.func,
  tracking: rpt.shape(trackingProps),
  withoutOrConjunction: rpt.bool,
  withoutBrackets: rpt.bool,
  useLastValidStateWhenErroneous: rpt.bool,
  autoFocusInput: rpt.bool,
  getSuggestionLabel: rpt.func
};

function getTagCatalogObservable([getTagCatalog, timeConfig]) {
  return getTagCatalog({ timeConfig });
}

function shouldAutomaticallyAddAConjunction(formModel, newElement, newElementIndex) {
  if (newElement.type !== TAG) {
    return false;
  }

  const previousElement = formModel[newElementIndex - 1];
  if (!previousElement) {
    return false;
  }

  return previousElement.type === CLOSE_BRACKET || previousElement.type === TAG;
}
