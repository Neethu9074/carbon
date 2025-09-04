/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { IconButtonSvgSizes } from '@instana/components/types/components/IconButton/types';
import { AutoReposition, IconButton, Stack } from '@instana/components';

import { CRITICAL, WARNING } from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { SmartAlertThresholdRuleUnion } from '@instana/types';

import { t } from 'in-i18n';

import locals from './SeverityColumn.mless';

export default function SeverityColumn({
  criticalThreshold,
  warningThreshold
}: {
  criticalThreshold?: SmartAlertThresholdRuleUnion | { severity: number };
  warningThreshold?: SmartAlertThresholdRuleUnion | { severity: number };
}) {
  return (
    <Stack direction="horizontal">
      <AutoReposition>
        {criticalThreshold && <SeverityIcon type={CRITICAL} icon="lib_error_filled" />}
        {warningThreshold && <SeverityIcon type={WARNING} icon="lib_help_error_warning" />}
      </AutoReposition>
    </Stack>
  );
}

export function SeverityIcon({
  type,
  icon,
  iconSize
}: {
  type: string;
  icon: string;
  iconSize?: keyof typeof IconButtonSvgSizes;
}) {
  return (
    <IconButton
      color={type === WARNING ? getDesignLibraryColorBySeverity(0.5) : undefined}
      kind="primaryv2"
      data-testid="restroreConfigButton"
      type={icon}
      alignment="right"
      className={type === WARNING ? locals.iconWarning : locals.iconCritical}
      iconSize={iconSize ?? 'xs'}
      iconDescription={
        type === WARNING
          ? t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')
          : t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')
      }
      isWrapperedByTooltip
      enterDelayMs={500}
    />
  );
}
