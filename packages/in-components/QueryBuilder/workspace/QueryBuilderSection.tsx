/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useEffect, useState } from 'react';

import { Button, Message, Stack } from '@instana/components';
import { TagCatalog } from '@instana/types';

import { GetSuggestionLabel, GetSuggestionsProps, QueryBuilderComponent, QueryBuilderTrackingFunctions } from '..';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { FormModelElement } from '../transformation/formModel';
import { emptyObject } from 'in-services/fixedObjects';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export const DEFAULT_MAX_EXPRESSION_DEPTH = 5;

interface QueryBuilderSectionProps {
  value: FormModelElement[];
  QueryBuilder: QueryBuilderComponent;
  getSuggestionsProps?: GetSuggestionsProps;
  getSuggestionLabel?: GetSuggestionLabel;
  onChange: (formModel: FormModelElement[]) => void;
  tracking?: QueryBuilderTrackingFunctions;
  tagCatalog?: TagCatalog;

  useLastValidStateWhenErroneous?: boolean;
  // Allows to limit the depth of expression nesting. It is unlimited by default.
  maxExpressionDepth?: number;

  hasError?: boolean;
  errors?: string[];

  actions?: ReactNode;
  withoutIcon?: boolean;
  allowEmptyKey?: boolean;
}

export default function QueryBuilderSection({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  actions,
  useLastValidStateWhenErroneous = false,
  hasError: hasExternalError,
  errors: externalErrors,
  tagCatalog,
  getSuggestionsProps = {},
  getSuggestionLabel
}: QueryBuilderSectionProps) {
  const [{ hasError: hasInternalError, errors: internalErrors }, setInternalError] = useState<{
    hasError?: boolean;
    errors?: string[];
  }>(emptyObject);

  const [clearRequested, setClearRequested] = useState(false);

  useEffect(() => {
    if (clearRequested) {
      setClearRequested(false);
    }
  }, [clearRequested]);

  useEffect(() => {
    setInternalError(emptyObject);
  }, [tagFilterExpression])

  return (
    <Section
      icon={withoutIcon ? undefined : 'lib_actions_filter'}
      title={t('in-components:queryBuilder.workspaceTitleFilter')}
      actions={
        <HorizontalFlexWrapper>
          {(tagFilterExpression.length > 0 || hasInternalError) && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
              {t('in-components:queryBuilder.workspaceButtonClear')}
            </Button>
          )}
          {actions}
        </HorizontalFlexWrapper>
      }
      hasError={hasExternalError || hasInternalError}
    >
      <Stack gap="xsmall">
        <div>
          <QueryBuilder
            // If the 'Clear' button was clicked, pass a new empty array instance, so that the query builder can
            // notice this change and reset its internal copy of the 'tagFilterExpression' ('currentFormModel').
            // This is needed, because the parent components can reuse the same 'tagFilterExpression' instance,
            // e.g. using the 'useStableObjectInstance' hook.
            value={clearRequested ? [] : tagFilterExpression}
            onChange={(tagFilterExpression: FormModelElement[]) => {
              // If the tag filter expression changes, reset the 'queryHasErrors' flag. In case that the updated
              // is invalid, the 'queryHasErrors' flag will be set again by the `onError` callback.
              setInternalError(emptyObject);
              onChange(tagFilterExpression);
            }}
            tagCatalog={tagCatalog}
            onError={setInternalError}
            tracking={tracking}
            useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
            getSuggestionsProps={getSuggestionsProps}
            getSuggestionLabel={getSuggestionLabel}
          />
        </div>
        {hasInternalError &&
          internalErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
        {hasExternalError &&
          externalErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
      </Stack>
    </Section>
  );

  function onClear() {
    tracking?.onQueryCleared?.();
    setClearRequested(true);
    setInternalError(emptyObject);
    onChange([]);
  }
}
