/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';

type OnChangeType = Parameters<typeof AlertProperties>[0]['onChange'];

export default function AlertPropertiesSection() {
  const { form, onChange } = useSloAlertFormContext();

  const alertConfigTitle = form.getIn(['name']).value;
  const alertType = form.getIn(['rule', 'alertType']).value;
  const threshold = form.getIn(['threshold']).value;

  const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
    context: alertType,
    percentage: threshold
  });
  const descriptionPlaceholder = t(
    'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
    {
      context: alertType,
      percentage: threshold
    }
  );
  const previewTitle = alertConfigTitle ? alertConfigTitle : titlePlaceholder;

  return (
    <AlertPropertiesContainer
      renderAlertProperties={() => (
        <AlertProperties
          form={form}
          onChange={onChange as OnChangeType}
          getDescriptionPlaceholder={() => descriptionPlaceholder}
          renderAlertPropertiesTitleRow={() => (
            <AlertPropertiesTitleRow
              form={form}
              placeholders={[]}
              onChange={onChange as OnChangeType}
              getTitlePlaceholder={() => titlePlaceholder}
            />
          )}
        />
      )}
      renderAlertPreview={() => (
        <AlertPreview
          form={form}
          renderHeadline={() => <AlertPreviewHeadline title={previewTitle} />}
          getDescriptionPlaceholder={() => descriptionPlaceholder}
          entityLabel={t('in-alerting:smartAlerts.slo.advancedModeContainer.alertProperties_entityLabel')}
          entityIconType="lib_service_level"
        />
      )}
    />
  );
}
