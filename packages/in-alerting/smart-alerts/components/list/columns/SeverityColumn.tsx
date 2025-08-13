/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SmartAlertThresholdRuleUnion } from '@instana/types';
import { IconButton, Stack } from '@instana/components';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from './SeverityColumn.mless';

export default function SeverityColumn({
  criticalThreshold,
  warningThreshold
}: {
  criticalThreshold?: SmartAlertThresholdRuleUnion;
  warningThreshold?: SmartAlertThresholdRuleUnion;
}) {
  return (
    <Stack direction="horizontal">
      {criticalThreshold && (
        <IconButton
          kind="primaryv2"
          data-testid="restroreConfigButton"
          type="lib_error_filled"
          alignment="right"
          className={locals.iconCritical}
          iconSize="xs"
          iconDescription={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
          isWrapperedByTooltip
        />
      )}
      {warningThreshold && (
        <IconButton
          color={getDesignLibraryColorBySeverity(0.5)}
          kind="primaryv2"
          data-testid="restroreConfigButton"
          type="lib_help_error_warning"
          alignment="right"
          className={locals.iconWarning}
          iconSize="xs"
          iconDescription={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
          isWrapperedByTooltip
        />
      )}
    </Stack>
  );
}
