/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, SvgIcon } from '@instana/components';

import { number } from 'in-services/formatters/number';
import { role } from 'in-stores/user';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './LogTooltipContent.mless';

export default function LogTooltipContent({ log }) {
  if (!role.canViewLogs) {
    return (
      <div className={locals.restrictedContent}>
        <Stack direction="vertical" gap="xxsmall">
          <Stack direction="horizontal" gap="xxsmall" align="center">
            <span className={locals.headingLabel}>
              {t('in-analyze:traceDetail.components.logTooltipContent.restrictedAccess')}
            </span>
            <SvgIcon className="icon" type="lib_actions_lock" size="xs" />
          </Stack>
          <span>{t('in-analyze:traceDetail.components.logTooltipContent.restrictedAccessExpl')}</span>
        </Stack>
      </div>
    );
  }

  return (
    <div className={locals.content}>
      <div className={log.errorCount > 0 ? locals.severityLabelFailure : locals.severityLabelWarning}>
        {log.errorCount > 0
          ? t('in-analyze:traceDetail.components.logTooltipContent.errorLog')
          : t('in-analyze:traceDetail.components.logTooltipContent.warningLog')}
      </div>
      <span className={locals.headingLabel}>{log.label}</span>
      {log.batchCount > 1 && (
        <div className={locals.batchCount}>
          <Pill kind="lighter" className={locals.pill}>
            {number.compact(log.batchCount)}
          </Pill>
          {t('in-analyze:traceDetail.components.logTooltipContent.batchCount', {
            count: number.compact(log.batchCount)
          })}
        </div>
      )}
    </div>
  );
}
