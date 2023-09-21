/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, StackItem, SvgIcon } from '@instana/components';
import { ApdexConfiguration } from '@instana/types';

import ApdexConfigInfo from 'in-custom-dashboards/widgets/Apdex/components/ApdexConfigInfo';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from './WidgetHeader.mless';

interface WidgetHeaderProps {
  title: string;
  entityType: ApdexEntityTypes;
  entityLabel: string;
  apdexConfig?: ApdexConfiguration;
  showPreviewDataNotice?: boolean;
}

export default function WidgetHeader({
  title,
  entityType,
  entityLabel,
  apdexConfig,
  showPreviewDataNotice
}: WidgetHeaderProps) {
  const theme = useTheme();
  const iconType = {
    website: 'lib_website',
    application: 'lib_application'
  }[entityType];
  const tooltipText = t('in-custom-dashboards:widgets.apdex.entityInfo.tooltip', { context: entityType });

  return (
    <Stack gap="xxsmall">
      <Stack direction="horizontal" align="center">
        <StackItem>
          <div className={locals.title}>{title}</div>
        </StackItem>
        <StackItem>
          <Stack direction="horizontal">
            <Tooltip content={tooltipText}>
              <SvgIcon type={iconType} color={theme.ids.color.option.neutral['600']} aria-label={tooltipText} />
            </Tooltip>
            <span className={locals.entityLabel}>{entityLabel}</span>
          </Stack>
        </StackItem>
        <ApdexConfigInfo apdexConfig={apdexConfig} />
      </Stack>
      {showPreviewDataNotice && (
        <span className={locals.subtext}>{t('in-custom-dashboards:widgets.apdex.widget.previewDataInfo')}</span>
      )}
    </Stack>
  );
}
