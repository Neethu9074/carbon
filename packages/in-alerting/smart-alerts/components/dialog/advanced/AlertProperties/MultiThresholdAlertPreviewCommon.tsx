/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Stack, Message } from '@instana/components';

import { ThresholdAlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/ThresholdAlertPreview';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon.mless';

interface MultiThresholdAlertPreviewCommonProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>, severity?: number) => string;
  isWarningDefined: boolean;
  isCriticalDefined: boolean;
  entityLabel: string;
  entityIconType: string;
  renderHeadline: () => React.ReactNode;
  isTearSheet?: boolean;
}

export function MultiThresholdAlertPreviewCommon({
  form,
  getDescriptionPlaceholder,
  isWarningDefined,
  isCriticalDefined,
  entityLabel,
  entityIconType,
  renderHeadline,
  isTearSheet = false
}: MultiThresholdAlertPreviewCommonProps) {
  return (
    <Stack gap="small">
      {!isWarningDefined && !isCriticalDefined && (
        <Message
          withIcon
          description={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPreviewMissingThresholdInfo')}
        />
      )}
      {isWarningDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <ThresholdAlertPreview
            form={form}
            getDescriptionPlaceholder={getDescriptionPlaceholder}
            entityLabel={entityLabel}
            entityIconType={entityIconType}
            severity={5}
            renderHeadline={renderHeadline}
            isTearSheet={isTearSheet}
          />
        </div>
      )}
      {isCriticalDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <ThresholdAlertPreview
            form={form}
            getDescriptionPlaceholder={getDescriptionPlaceholder}
            entityLabel={entityLabel}
            entityIconType={entityIconType}
            severity={10}
            renderHeadline={renderHeadline}
            isTearSheet={isTearSheet}
          />
        </div>
      )}
    </Stack>
  );
}
