/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';
import React from 'react';

import {
  infraPredictiveDetectionEnabled,
  oneMinuteGranularityForStaticThresholdEnabled,
  alertChannelPerSeverityInfraSaEnabled,
  incidentTriggeringInfraSaEnabled
} from 'in-services/featureFlags';
import {
  useGetAlertTitle,
  useFormattedThresholdValue,
  generateTitle,
  getTitlePlaceholderData
} from 'in-alerting/smart-alerts/infrastructure/hooks/useGetAlertTitle';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { MultiThresholdAlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import {
  fieldTouchedAndInvalid,
  isCustomPayloadValidOrUntouched
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { getAllowedPlaceholders } from 'in-alerting/smart-alerts/infrastructure/data/titlePlaceholders';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import ForecastAlerting from 'in-alerting/smart-alerts/infrastructure/components/ForecastAlerting';
import ScopeSection from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeSection';
import regexValidator from 'in-alerting/smart-alerts/infrastructure/data/regexValidator';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import TimeThreshold from 'in-alerting/smart-alerts/aggregated/TimeThreshold';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import { t } from 'in-i18n';

interface AdvancedModeContainerProp {
  updateForm?: (form: MapForm<any>) => void;
  messages?: MessageType[];
}

export default function AdvancedModeContainer(
  props: AdvancedModeContainerProp & AlertConfigDialogPresenterProps & MainDialogControl
) {
  const {
    form,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    updateForm,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    setTagFilterValid,
    tagFilterValid,
    TagBasedPayloadConfigurator,
    messages
  } = props;
  // For now, we support only static threshold. So taking type from warningThreshold/criticalThreshold would not change anything.
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const entityType = form.get('rule')?.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const isRegex = form.get('rule').get('regex')?.value;

  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex: isRegex });
  const groupBy = form.get('groupBy').value;

  const { aggregation, warningThreshold, criticalThreshold, thresholdOperatorValue, metricFormat } =
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

  const placeholders = getAllowedPlaceholders({ groupBy: toBackendGroupBy(groupBy) });

  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.title'),
          valid: isMetricAndEntityValid(form) && tagFilterValid,
          content: (
            <ScopeSection
              form={form}
              updateForm={updateForm}
              onChange={onChange}
              setTagFilterValid={setTagFilterValid}
              tagCatalog={tagCatalog}
              isRegex={isRegex}
            />
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.threshold.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.threshold.title'),
          valid: isThresholdSectionValid(),
          content: (
            <ThresholdSelectionInteractiveChart
              form={form}
              onChartViewConfigChange={onChartViewConfigChange}
              selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              updateForm={updateForm}
              tagCatalog={tagCatalog}
              regex={isRegex}
            />
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.timeThreshold.title'),
          valid: true,
          content: (
            <>
              <TimeThreshold
                form={form}
                updateForm={updateForm}
                onChange={onChange}
                oneMinuteGranularityAllowed={
                  thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
                }
              />
              <GracePeriodWrapper form={form} updateForm={updateForm} />
              {infraPredictiveDetectionEnabled && <ForecastAlerting form={form} updateForm={updateForm} />}
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.alertChannel.title'),
          valid: true,
          content: (
            <>
              {alertChannelPerSeverityInfraSaEnabled ? (
                <ConfigureAlertChannelMT
                  form={form}
                  onChange={onChange}
                  updateForm={updateForm}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              ) : (
                <ConfigureAlertChannel
                  form={form}
                  onChange={onChange}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              )}
            </>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.title'),
          valid: true,
          content: (
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
                      getTitlePlaceholder={() => ''}
                      titlePlaceholder={alertNameValue ?? generateTitle(alertTitle)}
                      placeholders={placeholders}
                      placeholderTooltipContent={t(
                        'in-alerting:smartAlerts.components.smartAlertDialog.groupingPlaceholdersMissingTooltip'
                      )}
                    />
                  )}
                  displayTriggerIncident={incidentTriggeringInfraSaEnabled}
                  shouldDisplayAlertLevelSelection={false}
                />
              )}
              renderAlertPreview={() => (
                <MultiThresholdAlertPreview
                  form={form}
                  getDescriptionPlaceholder={() => ''}
                  placeholderTitle={alertNameValue ?? generateTitle(alertTitle)}
                  placeholderDescription={alertDescriptionValue ?? alertDescription}
                  allowedPlaceholders={placeholders}
                />
              )}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.customPayloads.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.customPayloads.title'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: (
            <>
              <GlobalCustomPayloadCard context="INFRA" ownerType={entityType} />
              <AlertConfigCustomPayload
                form={form}
                setForm={updateForm}
                supportDynamicTypes
                TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
              />
            </>
          )
        }
      ]}
    />
  );

  function isThresholdSectionValid(): boolean {
    return !fieldTouchedAndInvalid(form.get('threshold'));
  }
}

export function isMetricAndEntityValid(form: MapForm<any>): boolean {
  const metric = form.get('rule')?.get('metricName')?.value;
  const entityType = form.get('rule')?.get('entityType')?.value;
  const regexpValidator = regexValidator((form as any)?.items);
  return (
    !fieldTouchedAndInvalid(form.get('rule')?.get('metricName')) &&
    !regexpValidator?.length &&
    !(metric.length && !entityType)
  );
}
