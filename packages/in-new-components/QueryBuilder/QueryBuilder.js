import React, { useRef, useLayoutEffect } from 'react';
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
import Conjunction from 'in-new-components/QueryBuilder/components/Conjunction';
import { onKeyDown } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Expression from 'in-new-components/QueryBuilder/components/Expression';
import Bracket from 'in-new-components/QueryBuilder/components/Bracket';
import Spacing from 'in-new-components/QueryBuilder/components/Spacing';
import Tag from 'in-new-components/QueryBuilder/components/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';

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

function QueryBuilder({ value: formModel, onChange }) {
  const renderModel = toRenderModel(formModel);
  const refContainer = useRef();

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
    <div ref={refContainer} className={locals.queryBuilder} onKeyDown={e => onKeyDown(e, refContainer.current)}>
      <Elements elements={renderModel} onRemove={onRemove} />
    </div>
  );

  function onRemove(formModelIndex, renderModelIndexToFocus, numberOfElementsToRemove = 1) {
    const copiedFormModel = formModel.slice();
    copiedFormModel.splice(formModelIndex, numberOfElementsToRemove);
    postUpdateFocus.current = {
      id: Date.now(),
      index: renderModelIndexToFocus
    };
    onChange(copiedFormModel);
  }
}

QueryBuilder.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.array.isRequired
};

function Elements({ elements, onRemove, depth = 0 }) {
  return (
    <>
      {elements.map((element, i) => {
        const Component = componentMapping[element.type];
        checkIfTypeIsHasSupportedComponent(Component, element.type);
        return (
          <Component key={i} {...element} onRemove={onRemove} depth={depth}>
            {element.elements && <Elements elements={element.elements} onRemove={onRemove} depth={depth + 1} />}
          </Component>
        );
      })}
    </>
  );
}

function checkIfTypeIsHasSupportedComponent(Component, type) {
  invariant(Component, `Unsupported element type '${type}' found in render model.`);
}
