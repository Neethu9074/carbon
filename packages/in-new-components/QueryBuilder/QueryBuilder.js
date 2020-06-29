import React, { useRef, useLayoutEffect } from 'react';
import invariant from 'invariant';
import rpt from 'prop-types';

import {
  toRenderModel,
  SPACING,
  TAG,
  CONJUNCTION,
  OPEN_BRACKET,
  CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import Conjunction from 'in-new-components/QueryBuilder/components/Conjunction';
import { onKeyDown } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Bracket from 'in-new-components/QueryBuilder/components/Bracket';
import Spacing from 'in-new-components/QueryBuilder/components/Spacing';
import Tag from 'in-new-components/QueryBuilder/components/Tag';
import ErrorBoundary from 'in-components/ErrorBoundary';

import locals from './QueryBuilder.mless';

const componentMapping = {
  [SPACING]: Spacing,
  [TAG]: Tag,
  [CONJUNCTION]: Conjunction,
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
      {renderModel.map((element, i) => {
        const Component = componentMapping[element.type];
        checkIfTypeIsHasSupportedComponent(Component, element.type);
        return <Component key={i} {...element} renderModelIndex={i} onRemove={onRemove} />;
      })}
    </div>
  );

  function onRemove(formModelIndex, renderModelIndexToFocus) {
    const copiedFormModel = formModel.slice();
    copiedFormModel.splice(formModelIndex, 1);
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

function checkIfTypeIsHasSupportedComponent(Component, type) {
  invariant(Component, `Unsupported element type '${type}' found in render model.`);
}
