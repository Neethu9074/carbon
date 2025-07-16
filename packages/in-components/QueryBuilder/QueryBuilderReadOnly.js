/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import {
  toRenderModel,
  SPACING,
  TAG,
  CONJUNCTION,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  EXPRESSION
} from 'in-components/QueryBuilder/transformation/renderModel';
import SpacingReadOnly from 'in-components/QueryBuilder/components/Spacing/SpacingReadOnly';
import ConjunctionReadOnly from 'in-components/QueryBuilder/components/ConjunctionReadOnly';
import ExpressionReadOnly from 'in-components/QueryBuilder/components/ExpressionReadOnly';
import BracketReadOnly from 'in-components/QueryBuilder/components/BracketReadOnly';
import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import TagReadOnly from 'in-components/QueryBuilder/components/Tag/TagReadOnly';
import { createTagForm } from 'in-components/QueryBuilder/validation/tagForm';
import ErrorBoundary from 'in-components/ErrorBoundary';

import locals from './QueryBuilder.mless';

const componentMapping = {
  [SPACING]: SpacingReadOnly,
  [TAG]: TagReadOnly,
  [CONJUNCTION]: ConjunctionReadOnly,
  [EXPRESSION]: ExpressionReadOnly,
  [OPEN_BRACKET]: BracketReadOnly,
  [CLOSE_BRACKET]: BracketReadOnly
};

export default function QueryBuilderReadOnlyErrorBoundry(props) {
  return (
    <ErrorBoundary name="QueryBuilderReadOnly">
      <QueryBuilderReadOnly {...props} />
    </ErrorBoundary>
  );
}

function QueryBuilderReadOnly({ value: formModel, tagCatalog, getSuggestions }) {
  if (!tagCatalog) {
    return <LoadingIndicator />;
  }

  const resolvedCreateTagForm = tagCatalog && createTagForm.bind(null, tagCatalog);

  const renderModel = toRenderModel(formModel);

  return (
    <div
      className={classNames({
        [locals.queryBuilder]: true,
        [locals.userSelectEnableForReadOnly]: true
      })}
    >
      <Elements
        createTagForm={resolvedCreateTagForm}
        getSuggestions={getSuggestions}
        tagCatalog={tagCatalog}
        elements={renderModel}
        formModel={formModel}
      />
    </div>
  );

  function Elements({ elements, getSuggestions, createTagForm, tagCatalog, depth = 0, formModel }) {
    return (
      <>
        {elements.map((element, i) => {
          const Component = componentMapping[element.type];

          return (
            <Component
              key={i}
              // Also forward element props as "element" in order to avoid problems caused by
              // React's reserved words, e.g. key or ref
              element={element}
              tagCatalog={tagCatalog}
              getSuggestions={getSuggestions}
              createTagForm={createTagForm}
              depth={depth}
              formModel={formModel}
            >
              {element.elements && (
                <Elements
                  tagCatalog={tagCatalog}
                  getSuggestions={getSuggestions}
                  createTagForm={createTagForm}
                  elements={element.elements}
                  depth={depth + 1}
                  formModel={formModel}
                />
              )}
            </Component>
          );
        })}
      </>
    );
  }
}
