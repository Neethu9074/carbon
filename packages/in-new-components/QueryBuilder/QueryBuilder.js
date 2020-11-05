import React, { useRef, useLayoutEffect, useState } from 'react';
import { create } from 'reactive-observables';
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
import DragAndDropBehaviour from 'in-new-components/QueryBuilder/DragAndDropBehaviour';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import { createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import Conjunction from 'in-new-components/QueryBuilder/components/Conjunction';
import Spacing from 'in-new-components/QueryBuilder/components/Spacing/Spacing';
import Expression from 'in-new-components/QueryBuilder/components/Expression';
import Bracket from 'in-new-components/QueryBuilder/components/Bracket';
import Tag from 'in-new-components/QueryBuilder/components/Tag/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';
import FilterButton from './components/FilterButton';
import useObservable from 'in-hooks/useObservable';
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

export default function QueryBuilderErrorBoundry(props) {
  return (
    <ErrorBoundary name="QueryBuilder">
      <QueryBuilder {...props} />
    </ErrorBoundary>
  );
}

function QueryBuilder({ value: formModel, getTagCatalog, getSuggestions, onChange, tracking }) {
  const timeConfig = useTimeConfig();
  const [draggedFormModelIndex$] = useState(create());
  const tagCatalog = useObservable(getTagCatalogObservable, [getTagCatalog, timeConfig]);
  const resolvedCreateTagForm = tagCatalog?.data && createTagForm.bind(null, tagCatalog);

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

  const renderModel = toRenderModel(formModel);

  return formModel.length === 0 ? (
    <FilterButton
      tagCatalog={tagCatalog.data}
      onAdd={onAddFormModelElement}
      formModelIndex={0}
      renderModelIndex={0}
      focus={focus}
    />
  ) : (
    <>
      <QueryBuilderDragAndDropBehaviour
        queryBuilderRef={refContainer}
        totalItems={formModel.length}
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
              onAdd={onAddFormModelElement}
              tagCatalog={tagCatalog.data}
              elements={renderModel}
              onRemove={onRemove}
              focus={focus}
              formModel={formModel}
            />
          </div>
        )}
      </QueryBuilderDragAndDropBehaviour>
      <FilterButton
        tagCatalog={tagCatalog.data}
        onAdd={onAddFormModelElement}
        formModelIndex={formModel.length}
        renderModelIndex={renderModel.length - 1}
        focus={focus}
        trailingButton
      />
    </>
  );

  function switchFormModelIndices(indexA, indexB) {
    if (indexA === indexB) {
      return;
    }

    const copiedFormModel = formModel.slice();
    const [tmp] = copiedFormModel.splice(indexA, 1);
    copiedFormModel.splice(indexB, 0, tmp);
    onChange(copiedFormModel);
  }

  function onChangeFormModelElement({ formModelIndex, renderModelIndex, newFormModel, changeFocus }) {
    updateFormModel({ formModelIndex, renderModelIndex, newFormModel, removeTargetItem: true, changeFocus });
  }

  function onAddFormModelElement({ formModelIndex, renderModelIndex, newFormModel }) {
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

    focus(
      nextFocusIndex,
      // Forced re-render not necessary because the onChange call down below will also
      // cause a re-render.
      false,
      childSelector
    );
    const updatedFormModel = updateFormModel({
      formModelIndex,
      renderModelIndex: renderModelIndex + 1,
      newFormModel,
      removeTargetItem: false
    });
    if (newFormModel.type === TAG) {
      tracking?.onTagAdded?.(newFormModel, updatedFormModel);
    }
  }

  function updateFormModel({ formModelIndex, renderModelIndex, newFormModel, removeTargetItem, changeFocus }) {
    const copiedFormModel = formModel.slice();
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
    const elementToRemove = formModel[formModelIndex];
    const copiedFormModel = formModel.slice();
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
  createTagForm,
  tagCatalog,
  onRemove,
  onChange,
  onAdd,
  focus,
  depth = 0,
  formModel
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
  onTagRemoved: rpt.func
};

QueryBuilder.propTypes = {
  value: rpt.array.isRequired,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  onChange: rpt.func.isRequired,
  tracking: rpt.shape(trackingProps)
};

function getTagCatalogObservable([getTagCatalog, timeConfig]) {
  return getTagCatalog({ timeConfig });
}
