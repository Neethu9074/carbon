/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Section from 'in-new-components/workspace/Section';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';

export default function QueryBuilderSection({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  actions,
  useLastValidStateWhenErroneous = false,
  hasError,
  errors
}) {
  const [queryHasErrors, setQueryHasErrors] = useState(false);
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
            value={tagFilterExpression}
            onChange={tagFilterExpression => {
              setQueryHasErrors(false);
              onChange(tagFilterExpression);
            }}
            onError={setQueryHasErrors}
            tracking={tracking}
            useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
          />
        </div>
        {hasError && errors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
      </Stack>
    </Section>
  );

  function onClear() {
    tracking?.onQueryCleared?.();
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
  errors: rpt.array
};
