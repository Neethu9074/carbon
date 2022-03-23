/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import SliConfigInfoTooltip from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoTooltip';
import { SliConfig, CombinedSliEntity } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import Tooltip from 'in-components/Tooltip';

import locals from './SliConfigInfo.mless';

interface SliConfigInfoProps<S extends MonitoringSource = MonitoringSource> {
  sliConfig?: SliConfig<CombinedSliEntity>;
  entityType: S;
}

export default function SliConfigInfo({ sliConfig, entityType }: SliConfigInfoProps) {
  if (!sliConfig?.sliEntity) {
    return null;
  }

  return (
    <Tooltip
      themeStyle="light"
      content={<SliConfigInfoTooltip sliConfig={sliConfig} entityType={entityType} />}
      align="bottomMiddle"
      delay={250}
    >
      <SvgIcon className={locals.sliInfo} type="lib_help_error_info_outline" size="s" />
    </Tooltip>
  );
}
