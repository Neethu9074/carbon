import rpt from 'prop-types';
import React from 'react';

import { trackingProps as groupingConfiguratorTrackingProps } from 'in-new-components/GroupingConfigurator/GroupingConfigurator';
import SectionLabelWithSubtext from 'in-new-components/workspace/SectionLabelWithSubtext';
import Section from 'in-new-components/workspace/Section';

export default function GroupBySection({
  value: group,
  tagFilterExpression,
  GroupingConfigurator,
  onChange,
  tracking,
  actions,
  additionalContent,
  withoutIcon,
  withOptionalMarker,
  hasError
}) {
  let title = 'Group';
  if (withOptionalMarker) {
    title = <SectionLabelWithSubtext subtext="Optional">{title}</SectionLabelWithSubtext>;
  }
  return (
    <Section icon={withoutIcon ? undefined : 'lib_group_by'} title={title} actions={actions} hasError={hasError}>
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
  withOptionalMarker: rpt.bool,
  tracking: rpt.shape(groupingConfiguratorTrackingProps),
  hasError: rpt.bool
};
