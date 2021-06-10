/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { trackingProps as groupingConfiguratorTrackingProps } from 'in-components/GroupingConfigurator/GroupingConfigurator';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

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
  let title = t('in-components:groupingConfigurator.titleGroup');
  if (withOptionalMarker) {
    title = (
      <SectionLabelWithSubtext subtext={t('in-components:groupingConfigurator.optional')}>
        {title}
      </SectionLabelWithSubtext>
    );
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
