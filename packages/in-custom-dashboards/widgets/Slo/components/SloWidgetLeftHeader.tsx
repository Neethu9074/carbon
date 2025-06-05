/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, SvgIcon, Tooltip, Typography } from '@instana/components';
import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Grid, Column } from '@instana/carbon';

import SloConfigInfo from 'in-custom-dashboards/widgets/Slo/components/SloConfigInfo/SloConfigInfo';
import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/components/SloEntityInfo';
import { t } from 'in-i18n';

import locals from './SloWidgetLeftHeader.mless';

interface WidgetLeftHeaderProps {
  isPreview?: boolean;
  sloConfig: ServiceLevelObjectiveConfiguration;
  title: string;
}

export default function SloWidgetLeftHeader({ isPreview, sloConfig, title }: WidgetLeftHeaderProps) {
  return (
    <Stack gap="xxsmall">
      <Grid className={locals.grid} condensed>
        <Column lg={8}>
          <Tooltip content={title} overflowEllipsis overwriteBlock>
            <div>
              <Typography variant="heading-03" noMargin noWrap align="center">
                {title}
              </Typography>
            </div>
          </Tooltip>
        </Column>
        <Column lg={8}>
          <Stack direction="horizontal" align="center">
            <Tooltip content={sloConfig.name} overflowEllipsis>
              <div>
                <SloEntityInfo entityType={sloConfig.entity.type} sloName={sloConfig.name} />
              </div>
            </Tooltip>
            <SloConfigInfo sloConfig={sloConfig} />
            <Tooltip content={t('in-custom-dashboards:widgets.slo.widgetLeftHeader.liveDataInfo')}>
              <SvgIcon type="lib_approximately_equal" size="s" />
            </Tooltip>
          </Stack>
        </Column>
      </Grid>
      {isPreview && (
        <Typography variant="body-small">
          {t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo')}
        </Typography>
      )}
    </Stack>
  );
}
