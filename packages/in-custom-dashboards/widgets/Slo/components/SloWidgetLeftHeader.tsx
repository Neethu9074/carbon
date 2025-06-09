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
import { t } from 'in-i18n';

import locals from './SloWidgetLeftHeader.mless';

interface WidgetLeftHeaderProps {
  isPreview?: boolean;
  sloConfig: ServiceLevelObjectiveConfiguration;
  title: string;
}

const totalGridColumns = 16;

export default function SloWidgetLeftHeader({ isPreview, sloConfig, title }: WidgetLeftHeaderProps) {
  const tooltipText = t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
    context: sloConfig.entity.type
  });

  return (
    <Stack gap="xxsmall">
      <Grid className={locals.grid} condensed fullWidth>
        <Column lg={getColumnSpanFromTitleLength(title)} className={locals.title}>
          <Tooltip content={title} overflowEllipsis overwriteBlock>
            <div>
              <Typography variant="heading-03" noMargin noWrap align="left">
                {title}
              </Typography>
            </div>
          </Tooltip>
        </Column>
        <Column lg={totalGridColumns - getColumnSpanFromTitleLength(title)} className={locals.column}>
          <Stack direction="horizontal" align="center">
            <Tooltip content={tooltipText}>
              <SvgIcon type={`lib_${sloConfig.entity.type}`} aria-label={tooltipText} />
            </Tooltip>
            <Tooltip content={sloConfig.name} overflowEllipsis overwriteBlock>
              <div className={locals.name}>
                <Typography variant="body-regular" noMargin noWrap align="left">
                  {sloConfig.name}
                </Typography>
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

function getColumnSpanFromTitleLength(title: string): number {
  const maxTitleLength = 50;
  const baseSpan = 3;
  const maxAdditionalSpan = 5;

  const titleLength = title?.length ?? 0;
  const cappedLength = Math.min(titleLength, maxTitleLength);
  const proportion = cappedLength / maxTitleLength;
  const span = (titleLength > 0 ? baseSpan : 1) + maxAdditionalSpan * proportion;

  return Math.round(span);
}
