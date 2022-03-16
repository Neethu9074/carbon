/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { LoadingSkeleton, Stack } from '@instana/components';

import { CombinedSliEntity, SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo';
import { SloEntity } from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/SloEntityInfo';
import { FetchStatus } from 'in-hooks/utils/types';

import locals from './WidgetLeftHeader.mless';

interface WidgetLeftHeaderProps {
  status: FetchStatus;
  sliConfig?: SliConfig<CombinedSliEntity>;
  monitoredEntityType: MonitoringSource;
  monitoredEntity?: SloEntity;
}

export default function WidgetLeftHeader({
  status,
  sliConfig,
  monitoredEntityType,
  monitoredEntity
}: WidgetLeftHeaderProps) {
  if (status === 'pending' || !monitoredEntity)
    return (
      <Stack direction="horizontal">
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Stack>
    );

  return (
    <>
      <SloEntityInfo entityType={monitoredEntityType} entity={monitoredEntity} />
      <SliConfigInfo sliConfig={sliConfig} entityType={monitoredEntityType} />
    </>
  );
}
