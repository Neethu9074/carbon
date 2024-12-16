/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, SvgIcon, Tooltip, Typography } from '@instana/components';
import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import SloConfigInfo from 'in-custom-dashboards/widgets/Slo/components/SloConfigInfo/SloConfigInfo';
import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/components/SloEntityInfo';
import { t } from 'in-i18n';

interface WidgetLeftHeaderProps {
  isPreview?: boolean;
  sloConfig: ServiceLevelObjectiveConfiguration;
  title: string;
}

export default function SloWidgetLeftHeader({ isPreview, sloConfig, title }: WidgetLeftHeaderProps) {
  return (
    <Stack gap="xxsmall">
      <Stack direction="horizontal" align="center">
        <Typography variant="heading-03" noMargin align="center">
          {title}
        </Typography>
        <SloEntityInfo entityType={sloConfig.entity.type} sloName={sloConfig.name} />
        <SloConfigInfo sloConfig={sloConfig} />
        <Tooltip content={t('in-custom-dashboards:widgets.slo.widgetLeftHeader.liveDataInfo')}>
          <SvgIcon type="lib_approximately_equal" size="s" />
        </Tooltip>
      </Stack>
      {isPreview && (
        <Typography variant="body-small">
          {t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo')}
        </Typography>
      )}
    </Stack>
  );
}
