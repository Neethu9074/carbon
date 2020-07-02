import React, { useRef, useLayoutEffect, useState } from 'react';
import invariant from 'invariant';
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
import { onKeyDown, onClickQueryBuilderContent } from 'in-new-components/QueryBuilder/keyboardInteraction';
import { createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import Conjunction from 'in-new-components/QueryBuilder/components/Conjunction';
import Expression from 'in-new-components/QueryBuilder/components/Expression';
import Bracket from 'in-new-components/QueryBuilder/components/Bracket';
import Spacing from 'in-new-components/QueryBuilder/components/Spacing';
import Tag from 'in-new-components/QueryBuilder/components/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';
import useObservable from 'in-hooks/useObservable';

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

function QueryBuilder({ value: formModel, onChange, getTagCatalog }) {
  const tagCatalog = useObservable(getTagCatalog(), [getTagCatalog]);
  const resolvedCreateTagForm = tagCatalog?.data && createTagForm.bind(null, tagCatalog);

  // TODO loading state?

  const refContainer = useRef();
  // To allow re-rendering when no React state has changed. We use this when we change the
  // postUpdateFocus ref in order to force React to re-execute the hooks. Updating a ref
  // does not cause a re-render hence this workaround.
  const forceRerender = useState()[1];
  const postUpdateFocus = useRef();
  const nextFocusId = postUpdateFocus.current?.id;
  useLayoutEffect(
    () => {
      const index = postUpdateFocus.current?.index;
      if (index != null && refContainer.current) {
        const focusableElements = refContainer.current.querySelectorAll(`[data-render-model-index]`);
        const nextFocusIndex = Math.max(0, Math.min(index, focusableElements.length - 1));
        const element = focusableElements[nextFocusIndex];
        if (element) {
          element.focus();
        }
      }
    },
    [nextFocusId]
  );

  return (
    <div
      ref={refContainer}
      className={locals.queryBuilder}
      onClick={e => onClickQueryBuilderContent(e, refContainer.current)}
      onKeyDown={e => onKeyDown(e, refContainer.current)}
    >
      <Elements
        elements={toRenderModel(formModel)}
        onRemove={onRemove}
        createTagForm={resolvedCreateTagForm}
        onChange={onChangeFormModelElement}
        focus={focus}
      />
    </div>
  );

  function onChangeFormModelElement(formModelIndex, renderModelIndex, newFormModel) {
    const copiedFormModel = formModel.slice();
    copiedFormModel.splice(formModelIndex, 1, newFormModel);
    focus(
      renderModelIndex,
      // Forced re-render not necessary because the onChange call down below will also
      // caused a re-render.
      false
    );
    onChange(copiedFormModel);
  }

  function onRemove(formModelIndex, renderModelIndexToFocus, numberOfElementsToRemove = 1) {
    const copiedFormModel = formModel.slice();
    copiedFormModel.splice(formModelIndex, numberOfElementsToRemove);
    focus(
      renderModelIndexToFocus,
      // Forced re-render not necessary because the onChange call down below will also
      // caused a re-render.
      false
    );
    onChange(copiedFormModel);
  }

  function focus(renderModelIndex, executeForcedRerender = true) {
    postUpdateFocus.current = {
      id: Date.now(),
      index: renderModelIndex
    };

    if (executeForcedRerender) {
      forceRerender(Date.now());
    }
  }
}

QueryBuilder.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.array.isRequired,
  getTagCatalog: rpt.func.isRequired
};

function Elements({ elements, onRemove, createTagForm, onChange, focus, depth = 0 }) {
  return (
    <>
      {elements.map((element, i) => {
        const Component = componentMapping[element.type];
        checkIfTypeIsHasSupportedComponent(Component, element.type);
        return (
          <Component
            key={i}
            {...element}
            onRemove={onRemove}
            createTagForm={createTagForm}
            onChange={newElement => onChange(element.formModelIndex, element.renderModelIndex, newElement)}
            focus={focus}
            depth={depth}
          >
            {element.elements && (
              <Elements
                elements={element.elements}
                onRemove={onRemove}
                createTagForm={createTagForm}
                onChange={onChange}
                focus={focus}
                depth={depth + 1}
              />
            )}
          </Component>
        );
      })}
    </>
  );
}

function checkIfTypeIsHasSupportedComponent(Component, type) {
  invariant(Component, `Unsupported element type '${type}' found in render model.`);
}
