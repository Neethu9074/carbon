/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import { tagSuggestionTimeConfig } from 'in-alerting/smart-alerts/synthetics/tearsheet/AlertConfigTearSheetWithThreshold';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/synthetics/hooks/useTagBasedPayloadConfigurator';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { allowedPlaceholders } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { getAlertTitle } from 'in-alerting/smart-alerts/synthetics/dialog/SyntheticsAlertProperties';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep3({
  form,
  onChange,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(tagSuggestionTimeConfig);
  const descriptionField = form.get('description') as Field<string>;

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
                  placeholderData={{ placeholders: allowedPlaceholders }}
                  widerPlaceholderBtn
                />
              )}
              shouldDisplayAlertLevelSelection
              isTearSheet
              placeholders={allowedPlaceholders}
              widerPlaceholderBtn
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
                renderHeadline={() => <AlertPreviewHeadline title={getAlertTitle(form.get('name'))} />}
                getDescriptionPlaceholder={getDescriptionPlaceholder}
                entityLabel={t('in-alerting:smartAlerts.synthetics.alertProperties.testName')}
                entityIconType="lib_synthetic"
                entityLabel2={t('in-alerting:smartAlerts.synthetics.alertProperties.locationName')}
                entityIconType2="lib_synthetic_location"
                descriptionWithReplacedPlaceholders={replacePlaceholdersWithMarkup(
                  allowedPlaceholders,
                  descriptionField?.value ?? '',
                  ({ name }) => name
                )}
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
