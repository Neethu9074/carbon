/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { CombinedSliEntity, SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { SloEntity } from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/SloEntityInfo';
import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/SliConfigInfo';

interface WidgetLeftHeaderProps {
  sliConfig?: SliConfig<CombinedSliEntity>;
  monitoredEntityType: MonitoringSource;
  monitoredEntity?: SloEntity;
}

export default function WidgetLeftHeader({ sliConfig, monitoredEntityType, monitoredEntity }: WidgetLeftHeaderProps) {
  if (!sliConfig || !monitoredEntity) {
    return <SvgIcon type="lib_actions_loading" spinning />;
  }

  return (
    <>
      <SloEntityInfo entityType={monitoredEntityType} entity={monitoredEntity} />
      <SliConfigInfo sliConfig={sliConfig} entityType={monitoredEntityType} />
    </>
  );
}
