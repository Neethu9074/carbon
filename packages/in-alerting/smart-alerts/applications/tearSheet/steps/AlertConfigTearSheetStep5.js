/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Typography } from '@instana/components';

import useTagBasedApplicationPayloadConfigurator from 'in-alerting/smart-alerts/applications/hooks/useTagBasedApplicationPayloadConfigurator';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import { ApplicationAlertPreview } from 'in-alerting/smart-alerts/applications/dialog/advanced/ApplicationAlertPreview';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { placeholdersByEvaluationType } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep5.mless';

export default function AlertConfigTearSheetStep5({ form, updateForm, onChange, applicationLabel }) {
  const evaluationType = form.get('evaluationType').value;
  const description = form.get('description').value;
  const triggering = form.get('triggering').value;
  const boundaryScope = form.get('boundaryScope')?.value || 'ALL';
  const applications = form.get('applications')?.value || {};
  const TagBasedPayloadConfigurator = useTagBasedApplicationPayloadConfigurator(applications, boundaryScope);

  return (
    <>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.AlertPropertiesTitle')}
        isFullWidth
      >
        <Spacer vertical="gutter" />
        <AlertPropertiesContainer
          renderAlertProperties={() => (
            <AlertProperties
              form={form}
              onChange={onChange}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              getPreviewTitlePlaceholder={getTitlePlaceholder}
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow
                  form={form}
                  onChange={onChange}
                  placeholders={placeholdersByEvaluationType[evaluationType]}
                  getTitlePlaceholder={getTitlePlaceholder}
                />
              )}
              isTearSheet
              shouldDisplayAlertLevelSelection={false}
            />
          )}
          renderAlertPreview={() => (
            <div className={locals.columnContainer}>
              <Typography variant="heading-200">
                {t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}
              </Typography>
              <ApplicationAlertPreview
                form={form}
                description={description}
                applicationLabel={applicationLabel}
                evaluationType={evaluationType}
                triggering={triggering}
                isTearSheet
              />
            </div>
          )}
          isTearSheet
        />
      </TearSheetStepContentWrapper>
      <Spacer vertical="medium" />
      <Spacer vertical="xxsmall" />
      <>
        <AlertTypography
          variant={'heading-200'}
          color={'color900'}
          content={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title')}
          noMargin
        />
        <div className={locals.columnContainer}>
          <GlobalCustomPayloadCard context="APPLICATION" />
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
