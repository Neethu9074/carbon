/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Li, Message } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertDescriptionRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertDescriptionRow';
import TriggersIncidentRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/TriggersIncidentRow';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import AlertLevelRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertLevelRow';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';
import Sections from 'in-components/workspace/Sections';

type OnChangeType = Parameters<typeof AlertProperties>[0]['onChange'];

export default function AlertPropertiesSection() {
  const { form, onChange } = useSloAlertFormContext();

  const alertConfigTitle = form.getIn(['name']).value;
  const alertMetric = form.getIn(['rule', 'metric']).value;
  const threshold = form.getIn(['threshold']).value;
  const operator = form.getIn(['operator']).value;
  const entityType = form.getIn(['entityType']).value;

  const showIncident = entityType === 'application';
  const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
    context: alertMetric
  });
  const descriptionPlaceholder = t(
    'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
    {
      context: alertMetric,
      percentage: alertMetric === 'BURN_RATE' ? threshold : percentageUpToTwoDecimalPlaces(threshold ?? 0),
      operator
    }
  );
  const previewTitle = alertConfigTitle ? alertConfigTitle : titlePlaceholder;

  return (
    <AlertPropertiesContainer
      renderAlertProperties={() => (
        <Sections>
          <AlertPropertiesTitleRow
            form={form}
            placeholders={[]}
            onChange={onChange as OnChangeType}
            getTitlePlaceholder={() => titlePlaceholder}
          />
          <AlertLevelRow onChange={onChange as OnChangeType} form={form} />
          {showIncident ? (
            <TriggersIncidentRow form={form} onChange={onChange as OnChangeType} />
          ) : (
            <Li>
              <Message
                type="warning"
                title={t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesIncidentWarning')}
              />
            </Li>
          )}

          <AlertDescriptionRow
            form={form}
            getDescriptionPlaceholder={() => descriptionPlaceholder}
            onChange={onChange as OnChangeType}
          />
        </Sections>
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
