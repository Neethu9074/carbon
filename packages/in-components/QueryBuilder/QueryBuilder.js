/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rpt from 'prop-types';

import { create } from '@instana/observables';

import {
  CLOSE_BRACKET,
  CONJUNCTION,
  EXPRESSION,
  OPEN_BRACKET,
  SPACING,
  TAG,
  toRenderModel
} from 'in-components/QueryBuilder/transformation/renderModel';
import QueryBuilderDragAndDropBehaviour from 'in-components/QueryBuilder/QueryBuilderDragAndDropBehaviour';
import { onClickQueryBuilderContent, onKeyDown } from 'in-components/QueryBuilder/keyboardInteraction';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import DragAndDropBehaviour from 'in-components/QueryBuilder/DragAndDropBehaviour';
import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import QueryBuilderReadOnly from 'in-components/QueryBuilder/QueryBuilderReadOnly';
import FilterButton from 'in-components/QueryBuilder/components/FilterButton';
import Conjunction from 'in-components/QueryBuilder/components/Conjunction';
import Spacing from 'in-components/QueryBuilder/components/Spacing/Spacing';
import Expression from 'in-components/QueryBuilder/components/Expression';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import Bracket from 'in-components/QueryBuilder/components/Bracket';
import Tag from 'in-components/QueryBuilder/components/Tag/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { LOG_MESSAGE } from 'in-logging/queryBuilder';

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
  tagCatalog,
  getSuggestions,
  getSuggestionsProps,
  onChange: onValidChange,
  onError,
  tracking,
  fixOverlayLeftAlignment,
  withoutOrConjunction = false,
  withoutBrackets = false,
  useLastValidStateWhenErroneous = false,
  maxExpressionDepth,
  autoFocusInput = false,
  getSuggestionLabel,
  allowEmptyKey = false,
  getTagCatalog,
  additionalGetTagCatalogProps,
  addTagDefinitionToFormModel,
  disableEntitySelection,
  source
}) {
  const [draggedFormModelIndex$] = useState(create());

  // Keep the fromMode state internally and notify the parent only about valid changes
  const [currentFormModel, setCurrentFormModel] = useState(formModel);

  const onChange = _formModel => {
    setCurrentFormModel(_formModel);

    if (!useLastValidStateWhenErroneous) {
      tracking?.onQueryChanged?.(_formModel);
      onValidChange(_formModel);
      return;
    }

    const { isValid, errors } = validateFormModel({
      tagCatalog: tagCatalog,
      formModel: _formModel,
      maxExpressionDepth,
      allowEmptyKey,
      disableEntitySelection
    });
    if (isValid) {
      tracking?.onQueryChanged?.(_formModel);
      onValidChange(_formModel);
    } else {
      onError({ hasError: true, errors: errors });
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

  if (!tagCatalog) {
    return <LoadingIndicator />;
  }

  const renderModel = toRenderModel(currentFormModel);

  return currentFormModel.length === 0 ? (
    <FilterButton
      tagCatalog={tagCatalog}
      onAdd={onAddFormModelElement}
      formModelIndex={0}
      renderModelIndex={0}
      focus={focus}
      fixOverlayLeftAlignment={fixOverlayLeftAlignment}
      withoutOrConjunction={withoutOrConjunction}
      withoutBrackets={withoutBrackets}
      getTagCatalog={getTagCatalog}
      additionalGetTagCatalogProps={additionalGetTagCatalogProps}
      addTagDefinitionToFormModel={addTagDefinitionToFormModel}
      disableEntitySelection={disableEntitySelection}
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
              onChange={onChangeFormModelElement}
              getSuggestions={getSuggestions}
              getSuggestionsProps={getSuggestionsProps}
              onAdd={onAddFormModelElement}
              tagCatalog={tagCatalog}
              elements={renderModel}
              onRemove={onRemove}
              focus={focus}
              source={source}
              formModel={currentFormModel}
              withoutOrConjunction={withoutOrConjunction}
              withoutBrackets={withoutBrackets}
              autoFocusInput={autoFocusInput}
              getSuggestionLabel={getSuggestionLabel}
              allowEmptyKey={allowEmptyKey}
              getTagCatalog={getTagCatalog}
              additionalGetTagCatalogProps={additionalGetTagCatalogProps}
              addTagDefinitionToFormModel={addTagDefinitionToFormModel}
              disableEntitySelection={disableEntitySelection}
            />
          </div>
        )}
      </QueryBuilderDragAndDropBehaviour>
      <FilterButton
        tagCatalog={tagCatalog}
        onAdd={onAddFormModelElement}
        formModelIndex={currentFormModel.length}
        renderModelIndex={renderModel.length - 1}
        focus={focus}
        fixOverlayLeftAlignment={fixOverlayLeftAlignment}
        trailingButton
        withoutOrConjunction={withoutOrConjunction}
        withoutBrackets={withoutBrackets}
        getTagCatalog={getTagCatalog}
        additionalGetTagCatalogProps={additionalGetTagCatalogProps}
        addTagDefinitionToFormModel={addTagDefinitionToFormModel}
        disableEntitySelection={disableEntitySelection}
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
    newFormModel = newFormModel.name === LOG_MESSAGE ? { ...newFormModel, operator: CONTAINS } : newFormModel;
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
  getSuggestionLabel,
  allowEmptyKey,
  getTagCatalog,
  additionalGetTagCatalogProps,
  addTagDefinitionToFormModel,
  disableEntitySelection,
  source
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
                source={source}
                dragAndDropProps={dragAndDropProps}
                draggedFormModelIndex$={draggedFormModelIndex$}
                formModel={formModel}
                withoutOrConjunction={withoutOrConjunction}
                withoutBrackets={withoutBrackets}
                autoFocusInput={autoFocusInput}
                getSuggestionLabel={getSuggestionLabel}
                allowEmptyKey={allowEmptyKey}
                getTagCatalog={getTagCatalog}
                additionalGetTagCatalogProps={additionalGetTagCatalogProps}
                addTagDefinitionToFormModel={addTagDefinitionToFormModel}
                disableEntitySelection={disableEntitySelection}
              >
                {element.elements && (
                  <Elements
                    tagCatalog={tagCatalog}
                    draggedFormModelIndex$={draggedFormModelIndex$}
                    switchFormModelIndices={switchFormModelIndices}
                    getSuggestions={getSuggestions}
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
                    allowEmptyKey={allowEmptyKey}
                    getTagCatalog={getTagCatalog}
                    additionalGetTagCatalogProps={additionalGetTagCatalogProps}
                    addTagDefinitionToFormModel={addTagDefinitionToFormModel}
                    disableEntitySelection={disableEntitySelection}
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

QueryBuilder.propTypes = {
  value: rpt.array.isRequired,
  tagCatalog: rpt.object,
  getSuggestions: rpt.func.isRequired,
  getSuggestionsProps: rpt.object,
  onChange: rpt.func.isRequired,
  onError: rpt.func,
  tracking: rpt.shape({
    onTagAdded: rpt.func,
    onTagRemoved: rpt.func,
    onQueryChanged: rpt.func
  }),
  fixOverlayLeftAlignment: rpt.bool,
  withoutOrConjunction: rpt.bool,
  withoutBrackets: rpt.bool,
  useLastValidStateWhenErroneous: rpt.bool,
  maxExpressionDepth: rpt.number,
  autoFocusInput: rpt.bool,
  getSuggestionLabel: rpt.func,
  allowEmptyKey: rpt.bool,
  getTagCatalog: rpt.func,
  additionalGetTagCatalogProps: rpt.object,
  addTagDefinitionToFormModel: rpt.bool,
  disableEntitySelection: rpt.bool,
  source: rpt.string
};

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
