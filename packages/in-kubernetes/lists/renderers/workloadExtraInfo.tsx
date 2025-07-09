/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Stack, Typography, Tooltip } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import { GenerateCardProps, getCounterByWorkload, WorkloadValues } from 'in-kubernetes/lists/utils';

import locals from './workloadExtraInfo.mless';

const renderUnhealthyIndicators = ({ cardId, item }: GenerateCardProps) => {
  const warningId = cardId === 'unhealthyDeployments' ? 'unhealthyDeploymentsWarnings' : 'unhealthyNodesWarnings';
  const criticalId = cardId === 'unhealthyDeployments' ? 'unhealthyDeploymentsCritical' : 'unhealthyNodesCritical';
  const warnings = getCounterByWorkload(warningId, item);
  const critical = getCounterByWorkload(criticalId, item);

  if (!warnings && !critical) {
    return null;
  }

  return (
    <div className={locals.additionalInfo}>
      <Stack direction="horizontal" gap="large">
        {critical > 0 && (
          <Tooltip content={`${t('in-kubernetes:cloudNative.critical')}: ${critical}`}>
            <Stack direction="horizontal" gap="small" align="center">
              <SvgIcon type="lib_help_error_error_circle" size="s" color={themes.default.cds.text.error} />
              <Typography variant="heading-compact-02" noMargin component="div">
                <span className={locals.alert}>{critical}</span>
              </Typography>
            </Stack>
          </Tooltip>
        )}
        {warnings > 0 && (
          <Tooltip content={`${t('in-kubernetes:cloudNative.warnings')}: ${warnings}`}>
            <Stack direction="horizontal" gap="small" align="center">
              <div className={locals.iconWarning}>
                <SvgIcon type="lib_help_error_warning" size="s" color={themes.default.cds.support.warning} />
              </div>
              <Typography variant="heading-compact-02" noMargin component="div">
                <span className={locals.alert}>{warnings}</span>
              </Typography>
            </Stack>
          </Tooltip>
        )}
      </Stack>
    </div>
  );
};

export const workloadExtraRenderers: Partial<Record<WorkloadValues, any>> = {
  unhealthyDeployments: renderUnhealthyIndicators,
  unhealthyNodes: renderUnhealthyIndicators
};
