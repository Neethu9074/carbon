import rpt from 'prop-types';
import React from 'react';

import { trackingProps as queryBuilderTrackingProps } from 'in-new-components/QueryBuilder/QueryBuilder';
import Section from 'in-new-components/workspace/Section';
import useThemedLocals from 'in-hooks/useThemedLocals';
import Button from 'in-new-components/Button';

import styleDefs from './QueryBuilderSection.mless';

export default function QueryBuilderSection({ value: tagFilterExpression, QueryBuilder, onChange, tracking }) {
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
        tagFilterExpression.length > 0 && (
          <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => onClear()}>
            Clear
          </Button>
        )
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
  QueryBuilder: rpt.func.isRequired,
  onChange: rpt.func.isRequired,
  tracking: rpt.shape({
    ...queryBuilderTrackingProps,
    onQueryCleared: rpt.func
  })
};
