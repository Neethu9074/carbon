/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  infraPredictiveDetectionEnabled,
  oneMinuteGranularityForStaticThresholdEnabled,
  alertChannelPerSeverityInfraSaEnabled
} from 'in-services/featureFlags';
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
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import InfraPredictiveTrigger from 'in-alerting/smart-alerts/infrastructure/components/InfraPredictiveTrigger';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { getAllowedPlaceholders } from 'in-alerting/smart-alerts/infrastructure/data/titlePlaceholders';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import ScopeSection from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeSection';
import regexValidator from 'in-alerting/smart-alerts/infrastructure/data/regexValidator';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import TimeThreshold from 'in-alerting/smart-alerts/aggregated/TimeThreshold';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
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
    TagBasedPayloadConfigurator
  } = props;
  // For now, we support only static threshold. So taking type from warningThreshold/criticalThreshold would not change anything.
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const entityType = form.get('rule')?.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const isRegex = form.get('rule').get('regex')?.value;
  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex: isRegex });
  const groupBy = form.get('groupBy').value;

  const placeholders = getAllowedPlaceholders({ groupBy: toBackendGroupBy(groupBy) });

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.title'),
          valid: isMetricAndEntityValid() && tagFilterValid,
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
              {infraPredictiveDetectionEnabled && <InfraPredictiveTrigger form={form} updateForm={updateForm} />}
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
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  renderAlertPropertiesTitleRow={() => (
                    <AlertPropertiesTitleRow
                      form={form}
                      onChange={onChange}
                      getTitlePlaceholder={getTitlePlaceholder}
                      placeholders={placeholders}
                      placeholderTooltipContent={t(
                        'in-alerting:smartAlerts.components.smartAlertDialog.groupingPlaceholdersMissingTooltip'
                      )}
                    />
                  )}
                  shouldDisplayAlertLevelSelection={false}
                />
              )}
              renderAlertPreview={() => (
                <MultiThresholdAlertPreview form={form} getDescriptionPlaceholder={getDescriptionPlaceholder} />
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
              <GlobalCustomPayloadCard context="INFRA" />
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
  function isMetricAndEntityValid(): boolean {
    const metric = form.get('rule')?.get('metricName')?.value;
    const entityType = form.get('rule')?.get('entityType')?.value;
    const regexpValidator = regexValidator((form as any)?.items);
    return (
      !fieldTouchedAndInvalid(form.get('rule')?.get('metricName')) &&
      !regexpValidator?.length &&
      !(metric.length && !entityType)
    );
  }
}
