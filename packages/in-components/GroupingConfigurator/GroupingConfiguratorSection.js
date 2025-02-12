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
  value,
  tagFilterExpression,
  GroupingConfigurator,
  tagCatalog,
  onChange,
  tracking,
  actions,
  additionalContent,
  withoutIcon,
  fixOverlayLeftAlignment,
  withOptionalMarker,
  hasError,
  additionalGetTagCatalogProps,
  SectionWrapper = Section
}) {
  const title = withOptionalMarker ? (
    <SectionLabelWithSubtext subtext={t('in-components:groupingConfigurator.optional')}>
      {t('in-components:groupingConfigurator.titleGroup')}
    </SectionLabelWithSubtext>
  ) : (
    t('in-components:groupingConfigurator.titleGroup')
  );

  return (
    <SectionWrapper icon={withoutIcon ? undefined : 'lib_group_by'} title={title} actions={actions} hasError={hasError}>
      <GroupingConfigurator
        value={value}
        fixOverlayLeftAlignment={fixOverlayLeftAlignment}
        tagFilterExpression={tagFilterExpression}
        onChange={onChange}
        tracking={tracking}
        tagCatalog={tagCatalog}
        additionalGetTagCatalogProps={additionalGetTagCatalogProps}
      />
      {additionalContent}
    </SectionWrapper>
  );
}

GroupBySection.propTypes = {
  value: rpt.oneOfType([rpt.object, rpt.array]),
  GroupingConfigurator: rpt.func.isRequired,
  tagFilterExpression: rpt.oneOfType([rpt.object, rpt.array]),
  onChange: rpt.func.isRequired,
  tagCatalog: rpt.object,
  actions: rpt.node,
  additionalContent: rpt.node,
  withoutIcon: rpt.bool,
  withOptionalMarker: rpt.bool,
  fixOverlayLeftAlignment: rpt.bool,
  tracking: rpt.shape(groupingConfiguratorTrackingProps),
  hasError: rpt.bool,
  additionalGetTagCatalogProps: rpt.object,
  SectionWrapper: rpt.func
};
