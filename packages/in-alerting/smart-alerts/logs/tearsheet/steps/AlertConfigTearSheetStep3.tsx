/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import {
  getAllowedPlaceholders,
  groupbyForPlaceholder
} from 'in-alerting/smart-alerts/components/utils/titlePlaceholders';
import { LogMultiThresholdAlertPreview } from 'in-alerting/smart-alerts/logs/dialog/advanced/LogMultiThresholdAlertPreview';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/logs/hooks/useTagBasedPayoadConfigurator';
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
  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator();
  const groupBy = form.get('groupBy').value;
  const placeholders = getAllowedPlaceholders({ groupBy: groupbyForPlaceholder(groupBy) });

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
                <AlertPropertiesTitleRow
                  form={form}
                  onChange={onChange}
                  getTitlePlaceholder={getTitlePlaceholder}
                  placeholderData={{
                    placeholders,
                    tooltip: t('in-alerting:smartAlerts.components.smartAlertDialog.groupingPlaceholdersMissingTooltip')
                  }}
                />
              )}
              shouldDisplayAlertLevelSelection={false}
              isTearSheet
            />
          )}
          renderAlertPreview={() => (
            <div className={locals.columnContainer}>
              <AlertTypography
                variant="heading-200"
                content={t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}
              />
              <LogMultiThresholdAlertPreview
                form={form}
                getDescriptionPlaceholder={getDescriptionPlaceholder}
                allowedPlaceholders={placeholders}
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
