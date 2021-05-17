/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { useEffect } from 'react';
import rpt from 'prop-types';

import { Button } from '@instana/components';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Section from 'in-new-components/workspace/Section';
import { emptyObject } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import { t } from 'in-i18n';

export const DEFAULT_MAX_EXPRESSION_DEPTH = 5;

export default function QueryBuilderSection({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  actions,
  useLastValidStateWhenErroneous = false,
  hasError: hasExteralError,
  errors: exteralErrors,
  getSuggestionsProps = {},
  getSuggestionLabel
}) {
  const [{ hasError: hasInternalError, errors: internalErrors }, setInternalError] = useState(emptyObject);
  const [clearRequested, setClearRequested] = useState(false);
  useEffect(() => {
    if (clearRequested) {
      setClearRequested(false);
    }
  }, [clearRequested]);

  return (
    <Section
      icon={withoutIcon ? undefined : 'lib_actions_filter'}
      title={t('in-new-components:queryBuilder.workspaceTitleFilter')}
      actions={
        <HorizontalFlexWrapper>
          {(tagFilterExpression.length > 0 || hasInternalError) && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
              {t('in-new-components:queryBuilder.workspaceButtonClear')}
            </Button>
          )}
          {actions}
        </HorizontalFlexWrapper>
      }
      hasError={hasExteralError || hasInternalError}
    >
      <Stack space="xsmall">
        <div>
          <QueryBuilder
            // If the 'Clear' button was clicked, pass a new empty array instance, so that the query builder can
            // notice this change and reset its internal copy of the 'tagFilterExpression' ('currentFormModel').
            // This is needed, because the parent components can reuse the same 'tagFilterExpression' instance,
            // e.g. using the 'useStableObjectInstance' hook.
            value={clearRequested ? [] : tagFilterExpression}
            onChange={tagFilterExpression => {
              // If the tag filter expression changes, reset the 'queryHasErrors' flag. In case that the updated
              // is invalid, the 'queryHasErrors' flag will be set again by the `onError` callback.
              setInternalError(emptyObject);
              onChange(tagFilterExpression);
            }}
            onError={setInternalError}
            tracking={tracking}
            useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
            getSuggestionsProps={getSuggestionsProps}
            getSuggestionLabel={getSuggestionLabel}
          />
        </div>
        {hasInternalError &&
          internalErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
        {hasExteralError &&
          exteralErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
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

QueryBuilderSection.propTypes = {
  value: rpt.array.isRequired,
  actions: rpt.node,
  QueryBuilder: rpt.func.isRequired,
  onChange: rpt.func.isRequired,
  withoutIcon: rpt.bool,
  tracking: rpt.shape({
    ...queryBuilderTrackingProps,
    onQueryCleared: rpt.func
  }),
  useLastValidStateWhenErroneous: rpt.bool,
  // Allows to limit the depth of expression nesting. It is unlimited by default.
  maxExpressionDepth: rpt.number,
  hasError: rpt.bool,
  errors: rpt.array,
  getSuggestionsProps: rpt.object,
  getSuggestionLabel: rpt.func
};
