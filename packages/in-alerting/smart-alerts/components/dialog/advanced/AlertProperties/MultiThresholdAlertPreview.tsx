/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Pill, Stack, Message } from '@instana/components';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreview.mless';

interface MultiThresholdAlertPreviewProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
}

export function MultiThresholdAlertPreview({ form, getDescriptionPlaceholder }: MultiThresholdAlertPreviewProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const isWarningThresholdDefined = !isEmpty(warningThresholdValue);
  const isCriticalThresholdDefined = !isEmpty(criticalThresholdValue);
  const metricLabel = form.get('hiddenFields').get('metricLabel').value;
  const entityLabel = metricLabel
    ? metricLabel
    : t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.preview.subtitle');
  const title = form.get('name').value || getTitlePlaceholder();

  return (
    <Stack gap="small">
      {!isWarningThresholdDefined && !isCriticalThresholdDefined && (
        <Message
          withIcon
          description={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPreviewMissingThresholdInfo')}
        />
      )}
      {isWarningThresholdDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <Stack gap="xsmall">
            <Pill kind="primary" type="high-contrast">
              {t('in-alerting:smartAlerts.components.smartAlertDialog.warningAlertPreviewLabel')}
            </Pill>
            <AlertPreview
              form={form}
              renderHeadline={() => <AlertPreviewHeadline title={title} />}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              entityLabel={entityLabel}
              entityIconType="lib_infrastructure"
              severity={5}
              isMultiThreshold
            />
          </Stack>
        </div>
      )}
      {isCriticalThresholdDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <Stack gap="xsmall">
            <Pill kind="primary" type="high-contrast">
              {t('in-alerting:smartAlerts.components.smartAlertDialog.criticalAlertPreviewLabel')}
            </Pill>
            <AlertPreview
              form={form}
              renderHeadline={() => <AlertPreviewHeadline title={title} />}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              entityLabel={entityLabel}
              entityIconType="lib_infrastructure"
              severity={10}
              isMultiThreshold
            />
          </Stack>
        </div>
      )}
    </Stack>
  );
}
