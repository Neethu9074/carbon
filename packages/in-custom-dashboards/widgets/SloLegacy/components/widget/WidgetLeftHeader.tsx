/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { LoadingSkeleton, Stack, StackItem, SvgIcon } from '@instana/components';

import { CombinedSliEntity, SliConfig } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import SliConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo';
import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { MonitoredEntity } from 'in-service-levels/utils/loadEntities';
import Tooltip from 'in-components/Tooltip/Tooltip';
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
  const labeledEntity = { id: monitoredEntity?.id ?? '', label: monitoredEntity?.label ?? '' };

  return (
    <Stack gap="xxsmall">
      <Stack direction="horizontal" align="center">
        <div className={locals.title}>{title}</div>
        <StackItem>
          {isLoading && <LoadingSkeleton className={locals.loadingSkeleton} />}
          {!isLoading && <SloEntityInfo entityType={monitoredEntityType} entities={[labeledEntity]} />}
        </StackItem>
        <SliConfigInfo sliConfig={sliConfig} entityType={monitoredEntityType} />
        <Tooltip align="auto" content={t('in-custom-dashboards:widgets.slo.widgetLeftHeader.liveDataInfo')}>
          <SvgIcon className={locals.approximateIcon} type="lib_approximately_equal" size="s" />
        </Tooltip>
      </Stack>
      {isPreview && (
        <span className={locals.subtext}>{t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo')}</span>
      )}
    </Stack>
  );
}
