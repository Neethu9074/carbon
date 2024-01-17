/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import InfraPredictiveTrigger from 'in-alerting/smart-alerts/infrastructure/components/InfraPredictiveTrigger';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import InfraTimeThreshold from 'in-alerting/smart-alerts/infrastructure/components/InfraTimeThreshold';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/eum/components/AlertPropertiesTitleRow';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import ScopeSection from 'in-alerting/smart-alerts/infrastructure/dialog/advanced//ScopeSection';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import regexValidator from 'in-alerting/smart-alerts/infrastructure/data/regexValidator';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
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
    timeConfig,
    setSliderState,
    setCustomSlideInHeaderConfig,
    setTagFilterValid,
    tagFilterValid
  } = props;
  const thresholdType = form.get('threshold').get('type').value;
  const metricLabel = form.get('hiddenFields').get('metricLabel').value;
  const entityType = form.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const isRegex = form.get('rule').get('regex')?.value;
  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex: isRegex });

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
              // @ts-expect-error updateForm is required
              updateForm={updateForm}
              timeConfig={timeConfig}
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
              <InfraTimeThreshold
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
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={7}
            />
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
                    />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <AlertPreview
                  form={form}
                  renderHeadline={() => (
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder()} />
                  )}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  entityLabel={
                    metricLabel
                      ? metricLabel
                      : t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.preview.subtitle')
                  }
                  entityIconType="lib_infrastructure"
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
              <GlobalCustomPayloadCard context="INFRA" />
              <AlertConfigCustomPayload form={form} setForm={updateForm} supportDynamicTypes={false} />
            </>
          )
        }
      ]}
    />
  );

  function isThresholdSectionValid(): boolean {
    return !fieldTouchedAndInvalid(form.get('threshold')?.get('value'));
  }
  function isMetricAndEntityValid(): boolean {
    const regexpValidator = regexValidator((form as any)?.items);
    return !fieldTouchedAndInvalid(form.get('rule')?.get('metricName')) && !regexpValidator?.length;
  }
}
