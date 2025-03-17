/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';
import React from 'react';

import { Spacer } from '@instana/components';

import {
  generateTitle,
  getTitlePlaceholderData,
  useFormattedThresholdValue,
  useGetAlertTitle
} from 'in-alerting/smart-alerts/infrastructure/hooks/useGetAlertTitle';
import { MultiThresholdAlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/infrastructure/hooks/useTagBasedPayloadConfigurator';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { getAllowedPlaceholders } from 'in-alerting/smart-alerts/infrastructure/data/titlePlaceholders';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import { InfraAlertRuleUnion } from 'in-types';
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
  const groupBy = form.get('groupBy').value;
  const placeholders = getAllowedPlaceholders({ groupBy: toBackendGroupBy(groupBy) });

  const alertConfigWithFormModel = form.toJS();
  const { rule } = alertConfigWithFormModel;
  const { metricName, entityType, regex } = rule as InfraAlertRuleUnion;

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator({ metricName, entityType, regex });

  const { aggregation, metric, warningThreshold, criticalThreshold, thresholdOperatorValue, metricFormat } =
    getTitlePlaceholderData(form);

  const alertNameValue = !isEmpty(form.get('name').value) ? form.get('name').value : undefined;
  const alertDescriptionValue = !isEmpty(form.get('description').value) ? form.get('description').value : undefined;

  const alertTitle = useGetAlertTitle(entityType, metric, aggregation);
  const alertDescription = useFormattedThresholdValue(
    alertTitle,
    thresholdOperatorValue(warningThreshold, criticalThreshold),
    metricFormat,
    warningThreshold,
    criticalThreshold
  );

  return (
    <>
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step3.header')}>
        <AlertPropertiesContainer
          renderAlertProperties={() => (
            <AlertProperties
              form={form}
              onChange={onChange}
              getDescriptionPlaceholder={() => ''}
              descriptionPlaceholder={alertDescriptionValue ?? alertDescription}
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow
                  form={form}
                  onChange={onChange}
                  placeholders={placeholders}
                  placeholderTooltipContent={t(
                    'in-alerting:smartAlerts.components.smartAlertDialog.groupingPlaceholdersMissingTooltip'
                  )}
                  getTitlePlaceholder={() => ''}
                  titlePlaceholder={alertNameValue ?? generateTitle(alertTitle)}
                  showDisabledPlaceholder
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
              <MultiThresholdAlertPreview
                form={form}
                getDescriptionPlaceholder={() => ''}
                placeholderTitle={alertNameValue ?? generateTitle(alertTitle)}
                placeholderDescription={alertDescriptionValue ?? alertDescription}
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
