/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3({
  form,
  onChange,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  return (
    <>
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.logs.tearSheet.step3.header')}>
        <AlertPropertiesContainer
          renderAlertProperties={() => (
            <AlertProperties
              form={form}
              onChange={onChange}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow form={form} onChange={onChange} getTitlePlaceholder={getTitlePlaceholder} />
              )}
              shouldDisplayAlertLevelSelection
              isTearSheet
            />
          )}
          renderAlertPreview={() => (
            <div className={locals.columnContainer}>
              <AlertTypography
                variant="heading-200"
                content={t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}
              />
              <AlertPreview
                form={form}
                renderHeadline={() => <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder()} />}
                getDescriptionPlaceholder={getDescriptionPlaceholder}
                entityLabel={t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.preview.subtitle')}
                entityIconType="lib_application_logging"
              />
            </div>
          )}
          isTearSheet
        />
      </TearSheetStepTitleWrapper>
      <Spacer size="large" />
      <>
        <AlertTypography
          variant="heading-200"
          color="color900"
          content={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title')}
          noMargin
        />
        <div className={locals.columnContainer}>
          <Spacer size="xxsmall" />
          <GlobalCustomPayloadCard context="LOG" isTearSheetView />
          <AlertConfigCustomPayload form={form} setForm={updateForm} supportDynamicTypes={false} isTearSheet />
        </div>
      </>
    </>
  );
}
