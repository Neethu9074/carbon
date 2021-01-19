/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Section from 'in-new-components/workspace/Section';
import Button from 'in-new-components/Button';

export default function QueryBuilderSection({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  actions
}) {
  return (
    <Section
      icon={withoutIcon ? undefined : 'lib_actions_filter'}
      title="Filter"
      actions={
        <HorizontalFlexWrapper>
          {tagFilterExpression.length > 0 && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
              Clear
            </Button>
          )}
          {actions}
        </HorizontalFlexWrapper>
      }
    >
      <QueryBuilder
        value={tagFilterExpression}
        onChange={tagFilterExpression => onChange(tagFilterExpression)}
        tracking={tracking}
      />
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
  })
};
