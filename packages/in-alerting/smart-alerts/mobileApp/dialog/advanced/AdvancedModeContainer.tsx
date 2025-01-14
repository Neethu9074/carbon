/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { HistoricBaselineData, isAdaptiveBaselineConfig, Result } from '@instana/types';

import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/eum/components/ThresholdSelectionInteractiveChart';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/BluePrintSelectionSection';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/eum/components/AlertTagFilterExpressionConfig';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import TimeThresholdConfig from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/TimeThresholdConfig';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/eum/components/AlertPropertiesTitleRow';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { mobileAppSmartAlertsAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import useMobileApp from 'in-mobile-apps/hooks/useMobileApp';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const {
    form,
    onChange,
    setSliderState,
    updateForm,
    setCustomSlideInHeaderConfig,
    isTagFilterFormModelValid,
    QueryBuilderComponent,
    editMode,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    TagBasedPayloadConfigurator,
    isDynamicCustomPayloadValid,
    thresholdResult
  } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const mobileAppId = form.get('mobileAppId')?.value;
  const [mobileApp] = useMobileApp(mobileAppId);
  const mobileAppOnThresholdTypeChange = useOnThresholdTypeChange(mobileAppCreateRuleForm);

  const resetChartConfigSelectionWhenAdaptiveBaseline = (updatedForm: MapForm<any>) => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange?.(0);
    }
    return updateForm?.(updatedForm);
  };

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.triggerTitle'),
          valid: true,
          content: (
            <>
              <BluePrintSelectionSection
                alertType={alertType}
                form={form}
                updateForm={updateForm}
                setSliderState={setSliderState}
              />
              {mobileAppSmartAlertsAdaptiveBaselineEnabled && blueprintConfig?.baselineEnabled && (
                <LightCard
                  title={t(
                    'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.staticOrAdaptiveTitle'
                  )}
                  withoutPadding
                  darkFrame
                >
                  <StaticOrAdaptiveSwitch
                    form={form}
                    setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
                    onThresholdTypeChange={mobileAppOnThresholdTypeChange}
                  />
                </LightCard>
              )}
            </>
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.scopeLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.scopeTitle'),
          valid: isTagFilterFormModelValid,
          content: (
            <AlertTagFilterExpressionConfig
              form={form}
              updateForm={updateForm}
              QueryBuilderComponent={QueryBuilderComponent}
              label={mobileApp?.label}
              iconType="lib_mobile_app"
            />
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.thresholdLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.thresholdTitle'),
          valid: isThresholdSectionValid(),
          content: (
            <>
              <ThresholdSelectionInteractiveChart
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                editMode={editMode}
                form={form}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                updateForm={updateForm}
                AlertingChartWithErrorMessage={MobileAppAlertingChartWithErrorMessage}
                eumType={mobileAppEum}
                isPercentageMetric={isPercentageMetric}
                getMetricUnitPostfix={getMetricUnitPostfix}
                ruleMetricNameOptions={ruleMetricNameOptions}
                AlertTypeSwitch={AlertTypeSwitch}
              />
              {thresholdType === HISTORIC_BASELINE && (
                <HistoricBaselineErrorMessage thresholdResult={thresholdResult as Result<HistoricBaselineData>} />
              )}
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.timeThresholdLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.timeThresholdTitle'),
          valid:
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('users')) &&
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('userPercentage')),
          content: (
            <>
              <TimeThresholdConfig
                form={form}
                onChange={onChange}
                updateForm={updateForm}
                impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
                hasUserImpactOption
                oneMinuteGranularityAllowed={thresholdType === STATIC_THRESHOLD}
              />
              <GracePeriodWrapper form={form} updateForm={updateForm} />
            </>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsTitle'),
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={5}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.propertiesTitle'),
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
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                  )}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  entityLabel={mobileApp?.label}
                  entityIconType="lib_mobile_app"
                />
              )}
            />
          )
        },
        {
          scrollId: '7',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.payloadsLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.payloadsTitle'),
          valid: isCustomPayloadValidOrUntouched(form) && isDynamicCustomPayloadValid,
          content: (
            <>
              <GlobalCustomPayloadCard context="MOBILE_APP" />

              <AlertConfigCustomPayload
                form={form}
                setForm={updateForm}
                TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
                supportDynamicTypes
              />
            </>
          )
        }
      ]}
    />
  );

  function isThresholdSectionValid() {
    // LATER: check correctness: on mobileapp it checks the value - touched state
    if (fieldTouchedAndInvalid(form.get('threshold'))) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) {
      return false;
    }
    if (!ruleComplete) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && (thresholdResult as Result<HistoricBaselineData>)?.errors?.length > 0) {
      return false;
    }
    return true;
  }
}
