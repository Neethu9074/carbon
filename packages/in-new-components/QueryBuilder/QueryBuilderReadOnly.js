/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import {
  toRenderModel,
  SPACING,
  TAG,
  CONJUNCTION,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  EXPRESSION
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import SpacingReadOnly from 'in-new-components/QueryBuilder/components/Spacing/SpacingReadOnly';
import ConjunctionReadOnly from 'in-new-components/QueryBuilder/components/ConjunctionReadOnly';
import BracketReadOnly from 'in-new-components/QueryBuilder/components/BracketReadOnly';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import TagReadOnly from 'in-new-components/QueryBuilder/components/Tag/TagReadOnly';
import { createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import Expression from 'in-new-components/QueryBuilder/components/Expression';
import ErrorBoundary from 'in-components/ErrorBoundary';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './QueryBuilder.mless';

const componentMapping = {
  [SPACING]: SpacingReadOnly,
  [TAG]: TagReadOnly,
  [CONJUNCTION]: ConjunctionReadOnly,
  [EXPRESSION]: Expression,
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

function QueryBuilderReadOnly({ value: formModel, getTagCatalog, getSuggestions }) {
  const timeConfig = useTimeConfig();
  const tagCatalog = useObservable(getTagCatalogObservable, [getTagCatalog, timeConfig]);

  const resolvedCreateTagForm = tagCatalog?.data && createTagForm.bind(null, tagCatalog);

  if (!tagCatalog?.data) {
    return <LoadingIndicator />;
  }

  const renderModel = toRenderModel(formModel);

  return (
    <div className={locals.queryBuilder}>
      <Elements
        createTagForm={resolvedCreateTagForm}
        getSuggestions={getSuggestions}
        tagCatalog={tagCatalog.data}
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

function getTagCatalogObservable([getTagCatalog, timeConfig]) {
  return getTagCatalog({ timeConfig });
}
