/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { LoadingSkeleton, Stack } from '@instana/components';

import { CombinedSliEntity, SliConfig } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { MonitoredEntity } from 'in-custom-dashboards/widgets/Slo/hooks/useMonitoredEntity';
import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/SloEntityInfo';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './WidgetLeftHeader.mless';

interface WidgetLeftHeaderProps {
  title: string;
  status: FetchStatus;
  sliConfig?: SliConfig<CombinedSliEntity>;
  monitoredEntityType: MonitoringSource;
  monitoredEntity?: MonitoredEntity;
  isPreview?: boolean;
}

export default function WidgetLeftHeader({
  title,
  status,
  sliConfig,
  monitoredEntityType,
  monitoredEntity,
  isPreview
}: WidgetLeftHeaderProps) {
  const isLoading = status === 'pending' || !monitoredEntity;

  return (
    <div className={locals.container}>
      <Stack direction="horizontal" align="center">
        <div className={locals.title}>{title}</div>
        {isLoading && <LoadingSkeleton className={locals.loadingSkeleton} />}
        {!isLoading && (
          <Stack direction="horizontal" gap="xxsmall" align="center">
            <SloEntityInfo entityType={monitoredEntityType} entity={monitoredEntity} />
            <SliConfigInfo sliConfig={sliConfig} entityType={monitoredEntityType} />
          </Stack>
        )}
      </Stack>
      {isPreview && (
        <span className={locals.subtext}>{t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo')}</span>
      )}
    </div>
  );
}
