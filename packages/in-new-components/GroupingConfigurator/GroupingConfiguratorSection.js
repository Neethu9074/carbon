import React from 'react';

import Section from 'in-new-components/workspace/Section';

export default function GroupBySection({ value: group, onChange, tagFilterExpression, GroupingConfigurator }) {
  return (
    <Section icon={'lib_group_by'} title={'Group'} firstLineAlignmentOffsetPx={2}>
      <GroupingConfigurator
        value={group}
        tagFilterExpression={tagFilterExpression}
        onChange={group => onChange(group)}
      />
    </Section>
  );
}
