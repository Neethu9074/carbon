import rpt from 'prop-types';
import React from 'react';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Section from 'in-new-components/workspace/Section';
import useThemedLocals from 'in-hooks/useThemedLocals';
import Button from 'in-new-components/Button';

import styleDefs from './QueryBuilderSection.mless';

export default function QueryBuilderSection(props) {
  const { value: tagFilterExpression, CustomActions, QueryBuilder, onChange, tracking } = props;

  const locals = useThemedLocals(styleDefs);
  const onClear = function() {
    tracking?.onQueryCleared?.();
    onChange([]);
  };

  return (
    <Section
      className={locals.queryBuilderSection}
      icon="lib_actions_filter"
      title="Filter"
      firstLineAlignmentOffsetPx={4}
      actions={
        <HorizontalFlexWrapper>
          {tagFilterExpression.length > 0 && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => onClear()}>
              Clear
            </Button>
          )}
          {CustomActions && <CustomActions {...props} />}
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
}

QueryBuilderSection.propTypes = {
  value: rpt.array.isRequired,
  CustomActions: rpt.elementType,
  QueryBuilder: rpt.func.isRequired,
  onChange: rpt.func.isRequired,
  tracking: rpt.shape({
    ...queryBuilderTrackingProps,
    onQueryCleared: rpt.func
  })
};
