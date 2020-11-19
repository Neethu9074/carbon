import React from 'react';

import Section from 'in-new-components/workspace/Section';
import useThemedLocals from 'in-hooks/useThemedLocals';
import Button from 'in-new-components/Button';

import styleDefs from './QueryBuilderSection.mless';

export default function QueryBuilderSection({ value: tagFilterExpression, onChange, QueryBuilder }) {
  const locals = useThemedLocals(styleDefs);
  return (
    <Section
      className={locals.queryBuilderSection}
      icon="lib_actions_filter"
      title="Filter"
      firstLineAlignmentOffsetPx={3}
      actions={
        tagFilterExpression.length > 0 && (
          <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => onChange([])}>
            Clear
          </Button>
        )
      }
    >
      <QueryBuilder value={tagFilterExpression} onChange={tagFilterExpression => onChange(tagFilterExpression)} />
    </Section>
  );
}
