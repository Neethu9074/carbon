import React from 'react';

import Section from 'in-new-components/workspace/Section';
import Button from 'in-new-components/Button';

export default function QueryBuilderSection({ value: tagFilterExpression, onChange, QueryBuilder }) {
  return (
    <Section
      icon="lib_actions_filter"
      title="Filter"
      firstLineAlignmentOffsetPx={7}
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
