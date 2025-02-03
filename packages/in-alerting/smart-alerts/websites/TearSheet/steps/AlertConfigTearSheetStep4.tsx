/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/websites/hooks/useTagBasedPayloadConfigurator';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep4.mless';

export default function AlertConfigTearSheetStep4({ form, onChange, updateForm }: any) {
  const websiteId = form.get('websiteId')?.value ?? undefined;
  const websiteLabel = useWebsiteLabel(form.get('websiteId')?.value) ?? undefined;
  const metricName = form.get('rule')?.get('metricName')?.value;
  const alertType = form.get('rule')?.get('alertType')?.value;

  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;
  const isCriticalDefined = criticalThresholdField.get('isCheckboxSelected').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, websiteId);

  return (
    <>
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.websites.tearSheet.step2.description')}>
        <AlertPropertiesContainer
          renderAlertProperties={() => (
            <AlertProperties
              form={form}
              onChange={onChange}
              // @ts-expect-error TODO fix type error in common component
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              getPreviewTitlePlaceholder={getTitlePlaceholder}
              shouldDisplayAlertLevelSelection={false}
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow form={form} onChange={onChange} getTitlePlaceholder={getTitlePlaceholder} />
              )}
              isTearSheet
            />
          )}
          renderAlertPreview={() => (
            <div className={locals.columnContainer}>
              <AlertTypography
                variant="heading-200"
                content={t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}
              />
              <MultiThresholdAlertPreviewCommon
                form={form}
                // @ts-expect-error TODO fix type error in common component
                getDescriptionPlaceholder={getDescriptionPlaceholder}
                isWarningDefined={isWarningDefined}
                isCriticalDefined={isCriticalDefined}
                entityLabel={websiteLabel ?? ''}
                entityIconType="lib_website"
                renderHeadline={() => (
                  <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                )}
                isTearSheet
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
          <GlobalCustomPayloadCard context="INFRA" isTearSheetView />
          <AlertConfigCustomPayload
            form={form}
            setForm={updateForm}
            TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
            supportDynamicTypes
            isTearSheet
          />
        </div>
      </>
    </>
  );
}
