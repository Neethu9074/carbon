import rpt from 'prop-types';
import React from 'react';

import { trackingProps as groupingConfiguratorTrackingProps } from 'in-new-components/GroupingConfigurator/GroupingConfigurator';
import Section from 'in-new-components/workspace/Section';

export default function GroupBySection({
  value: group,
  tagFilterExpression,
  GroupingConfigurator,
  onChange,
  tracking,
  actions,
  additionalContent,
  withoutIcon
}) {
  return (
    <Section icon={withoutIcon ? undefined : 'lib_group_by'} title="Breakdown" actions={actions}>
      <GroupingConfigurator
        value={group}
        tagFilterExpression={tagFilterExpression}
        onChange={onChange}
        tracking={tracking}
      />
      {additionalContent}
    </Section>
  );
}

GroupBySection.propTypes = {
  value: rpt.object,
  GroupingConfigurator: rpt.func.isRequired,
  tagFilterExpression: rpt.object.isRequired,
  onChange: rpt.func.isRequired,
  actions: rpt.node,
  additionalContent: rpt.node,
  withoutIcon: rpt.bool,
  tracking: rpt.shape(groupingConfiguratorTrackingProps)
};
