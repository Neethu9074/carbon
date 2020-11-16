import rpt from 'prop-types';
import React from 'react';

import { trackingProps as groupingConfiguratorTrackingProps } from 'in-new-components/GroupingConfigurator/GroupingConfigurator';
import Section from 'in-new-components/workspace/Section';

export default function GroupBySection({
  value: group,
  tagFilterExpression,
  GroupingConfigurator,
  onChange,
  tracking
}) {
  return (
    <Section icon={'lib_group_by'} title={'Group'} firstLineAlignmentOffsetPx={2}>
      <GroupingConfigurator
        value={group}
        tagFilterExpression={tagFilterExpression}
        onChange={group => onChange(group)}
        tracking={tracking}
      />
    </Section>
  );
}

GroupBySection.propTypes = {
  value: rpt.object,
  GroupingConfigurator: rpt.func.isRequired,
  tagFilterExpression: rpt.object.isRequired,
  onChange: rpt.func.isRequired,
  tracking: rpt.shape(groupingConfiguratorTrackingProps)
};
