/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { useEffect } from 'react';
import rpt from 'prop-types';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Section from 'in-new-components/workspace/Section';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function QueryBuilderSection({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  actions,
  useLastValidStateWhenErroneous = false,
  hasError,
  errors,
  getSuggestionsProps = {},
  getSuggestionLabel
}) {
  const [queryHasErrors, setQueryHasErrors] = useState(false);
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
          {(tagFilterExpression.length > 0 || queryHasErrors) && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
              {t('in-new-components:queryBuilder.workspaceButtonClear')}
            </Button>
          )}
          {actions}
        </HorizontalFlexWrapper>
      }
      hasError={hasError || queryHasErrors}
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
              setQueryHasErrors(false);
              onChange(tagFilterExpression);
            }}
            onError={setQueryHasErrors}
            tracking={tracking}
            useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
            getSuggestionsProps={getSuggestionsProps}
            getSuggestionLabel={getSuggestionLabel}
          />
        </div>
        {hasError && errors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
      </Stack>
    </Section>
  );

  function onClear() {
    tracking?.onQueryCleared?.();
    setClearRequested(true);
    setQueryHasErrors(false);
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
  hasError: rpt.bool,
  errors: rpt.array,
  getSuggestionsProps: rpt.object,
  getSuggestionLabel: rpt.func
};
