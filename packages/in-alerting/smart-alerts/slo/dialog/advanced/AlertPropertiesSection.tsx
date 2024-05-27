/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SloEntity, SloEntityType, isApplicationSloEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
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
import { getDescriptionPlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import Section from 'in-components/workspace/Section/Section';

type OnChangeType = Parameters<typeof AlertProperties>[0]['onChange'];
interface AlertPropertiesSectionProps {
  targetEntity: SloEntityType;
}

export default function AlertPropertiesSection({ targetEntity }: AlertPropertiesSectionProps) {
  const { form, onChange, mode } = useSloAlertFormContext();
  const alertConfigTitle = form.getIn(['name']).value;
  const alertType = form.getIn(['rule', 'alertType']).value;
  const threshold = form.getIn(['threshold']).value;
  const isApplication = targetEntity === 'application';
  const sloId = form.getIn(['sloIds']).value[0];

  const sloConfig = useObservable(() => {
    return getSloConfiguration(sloId);
  }, [sloId]);

  const sloEntity = sloConfig?.data?.entity;
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
  const hideIncident = (sloEntity: SloEntity | undefined) => {
    if (mode === 'EDIT') {
      return sloEntity && isApplicationSloEntity(sloEntity);
    } else if (mode === 'NEW' && isApplication) {
      return true;
    }
    return false;
  };

  // const incidentSubTitle = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesIncidentWarning');
  return (
    <AlertPropertiesContainer
      renderAlertProperties={() => (
        <>
          <AlertPropertiesTitleRow
            form={form}
            placeholders={[]}
            onChange={onChange as OnChangeType}
            getTitlePlaceholder={() => titlePlaceholder}
          />
          <AlertLevelRow onChange={onChange as OnChangeType} form={form} />
          {hideIncident(sloEntity) ? (
            <TriggersIncidentRow form={form} onChange={onChange as OnChangeType} />
          ) : (
            <Section
              title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
              icon="lib_events_incident"
            >
              <Message type="warning">
                {t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesIncidentWarning')}
              </Message>
            </Section>
          )}
          <AlertDescriptionRow
            form={form}
            getDescriptionPlaceholder={getDescriptionPlaceholder}
            onChange={onChange as OnChangeType}
          />
        </>
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
