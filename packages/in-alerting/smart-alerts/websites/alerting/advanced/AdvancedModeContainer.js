/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  websitesAlertingAdditionalPropsAlertLevelChanged,
  websitesAlertingAdditionalPropsDescriptionChanged,
  websitesAlertingAdditionalPropsTitleChanged,
  websitesAlertingAdditionalPropsTriggerChanged,
  websitesAlertingBlueprintChanged
} from 'in-alerting/smart-alerts/websites/alerting/tracker';
import {
  getFormValueOrDefault,
  getDescriptionPlaceholder,
  getTitlePlaceholder
} from 'in-alerting/smart-alerts/websites/alerting/form/formUtils';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import { default as GlobalAdvancedModeContainer } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/alerting/components/AlertTagFilterExpressionConfig';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/websites/alerting/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/websites/alerting/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/websites/alerting/data/blueprintConfig';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/websites/alerting/advanced/SlownessInteractiveChart';
import JsErrorsInteractiveChart from 'in-alerting/smart-alerts/websites/alerting/advanced/JsErrorsInteractiveChart';
import BlueprintSelection from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/BlueprintSelection';
import BaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/BaselineErrorMessage';
import AlertLocationFilters from 'in-alerting/smart-alerts/websites/alerting/components/AlertLocationFilters';
import SelectAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/SelectAlertChannel';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/alerting/advanced/TimeThresholdConfig';
import ProvideStatusCode from 'in-alerting/smart-alerts/websites/alerting/components/ProvideStatusCode';
import { fieldNames } from 'in-alerting/smart-alerts/websites/alerting/form/alertDialogFormDefinition';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/alerting/components/AlertTypeSwitch';
import ProvideJsError from 'in-alerting/smart-alerts/websites/alerting/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/alerting/constants';
import WithQB1orQB2 from 'in-alerting/components/WithQB1orQB2';
import LightCard from 'in-new-components/Card/LightCard';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    websiteLabel,
    timeConfig,
    onChange,
    setSliderState,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    QueryBuilderComponent,
    isTagFilterFormModelValid
  } = props;
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: t('in-websites:alerting.advanced.scopeLabel'),
          title: t('in-websites:alerting.advanced.scopeTitle'),
          content: (
            <>
              <WithQB1orQB2
                onUsesQB1={() => (
                  <AlertLocationFilters
                    form={form}
                    websiteLabel={websiteLabel}
                    timeConfig={timeConfig}
                    updateForm={updateForm}
                  />
                )}
                onUsesQB2={() => (
                  <AlertTagFilterExpressionConfig
                    form={form}
                    updateForm={updateForm}
                    websiteLabel={websiteLabel}
                    QueryBuilderComponent={QueryBuilderComponent}
                  />
                )}
                shouldFallbackToQB2={isQB2Config => isQB2Config(form.get('convertedTagFilterExpression').value)}
              />
            </>
          ),
          checked: true
        },
        {
          scrollId: '2',
          label: t('in-websites:alerting.advanced.triggerLabel'),
          title: t('in-websites:alerting.advanced.triggerTitle'),
          checked: validateTrigger(form),
          content: (
            <>
              <BlueprintSelection
                form={form}
                updateForm={updateForm}
                blueprintConfigs={blueprintConfigs}
                createBlueprintForm={createBlueprintForm}
                trackBlueprintChange={newBlueprint =>
                  websitesAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })
                }
              />
              <AlertTypeSwitch
                alertType={alertType}
                renderJsErrors={() => (
                  <>
                    <LightCard title={t('in-websites:alerting.advanced.JSErrorMessage')} withoutPadding darkFrame>
                      <ProvideJsError
                        form={form}
                        timeConfig={{
                          windowSize: alertingDialogItemPickerTimeframe
                        }}
                        updateForm={updateForm}
                        onSelectJsError={setSliderState}
                        mode={modeAdvanced}
                      />
                    </LightCard>
                    <JsErrorsInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
                renderSlowness={() => (
                  <>
                    <SlownessInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                    <BaselineErrorMessage thresholdResult={thresholdResult} />
                  </>
                )}
                renderStatusCode={() => (
                  <>
                    <LightCard title={t('in-websites:alerting.advanced.HTTPStatusCode')} withoutPadding darkFrame>
                      <ProvideStatusCode form={form} updateForm={updateForm} mode={modeAdvanced} />
                    </LightCard>
                    <StatusCodeInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      onChange={onChange}
                      updateForm={updateForm}
                      timeConfig={timeConfig}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
                renderThroughput={() => (
                  <>
                    <ThroughputInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                    <BaselineErrorMessage thresholdResult={thresholdResult} />
                  </>
                )}
              />
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-websites:alerting.advanced.timeThresholdLabel'),
          title: t('in-websites:alerting.advanced.timeThresholdTitle'),
          checked: true,
          content: (
            <TimeThresholdConfig
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
              hasUserImpactOption
            />
          )
        },
        {
          scrollId: '4',
          label: t('in-websites:alerting.advanced.alertChannelsLabel'),
          title: t('in-websites:alerting.advanced.alertChannelsTitle'),
          checked: form.get(fieldNames.alertChannelIds).value.length > 0,
          content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
        },
        {
          scrollId: '5',
          label: t('in-websites:alerting.advanced.propertiesLabel'),
          title: t('in-websites:alerting.advanced.propertiesTitle'),
          checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value),
          content: (
            <AlertPropertiesContainer
              form={form}
              onChange={onChange}
              label={websiteLabel}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              getTitlePlaceholder={getTitlePlaceholder}
              trackAlertLevelChanged={websitesAlertingAdditionalPropsAlertLevelChanged}
              trackDescriptionChanged={websitesAlertingAdditionalPropsDescriptionChanged}
              trackTitleChanged={websitesAlertingAdditionalPropsTitleChanged}
              trackTriggerChanged={websitesAlertingAdditionalPropsTriggerChanged}
            />
          )
        }
      ]}
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );
}

function validateTrigger(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;

  if (alertType === 'specificJsError') {
    return Boolean(ruleForm.get('alertType').value && getFormValueOrDefault(ruleForm, 'value'));
  } else {
    return true;
  }
}
