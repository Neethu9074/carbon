/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { allowedPlaceholders } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep3({
  form,
  onChange,
  updateForm,
  TagBasedPayloadConfigurator
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  TagBasedPayloadConfigurator: React.ReactNode;
}) {
  return (
    <>
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.synthetics.tearSheet.step3.header')}>
        <AlertPropertiesContainer
          renderAlertProperties={() => (
            <AlertProperties
              form={form}
              onChange={onChange}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow
                  form={form}
                  onChange={onChange}
                  getTitlePlaceholder={getTitlePlaceholder}
                  placeholders={allowedPlaceholders}
                />
              )}
              shouldDisplayAlertLevelSelection
              isTearSheet
            />
          )}
          renderAlertPreview={() => (
            <Stack>
              <AlertTypography
                variant="heading-200"
                content={t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}
              />
              <AlertPreview
                form={form}
                renderHeadline={() => <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder()} />}
                getDescriptionPlaceholder={getDescriptionPlaceholder}
                entityLabel={t('in-alerting:smartAlerts.synthetics.alertProperties.testName')}
                entityIconType="lib_synthetic"
                entityLabel2={t('in-alerting:smartAlerts.synthetics.alertProperties.locationName')}
                entityIconType2="lib_synthetic_location"
              />
            </Stack>
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
        <Stack>
          <Spacer size="xxsmall" />
          <GlobalCustomPayloadCard context="SYNTHETIC" isTearSheetView />
          <AlertConfigCustomPayload
            form={form}
            setForm={updateForm}
            TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
            supportDynamicTypes
            isTearSheet
          />
        </Stack>
      </>
    </>
  );
}
