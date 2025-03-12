/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import { ruleMetricNameOptions as mobileAppRuleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/CustomEventsThresholdCondition';
import { ruleMetricNameOptions as websiteRuleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/ThroughputThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/StatusCodeThresholdCondition';
import InvalidFilterMessage from 'in-alerting/smart-alerts/components/tearSheet/TagfilterValidator/InvalidFilterMessage';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/SlownessThresholdCondition';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/JsErrorsThresholdCondition';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import CrashThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/CrashThresholdCondition';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';

export default function ThresholdSelectionInteractiveSection({
  form,
  updateForm,
  editMode,
  onChartViewConfigChange,
  alertType,
  blueprintConfig,
  eumType,
  isPercentageMetric,
  getMetricUnitPostfix,
  thresholdType,
  thresholdResult,
  AlertTypeSwitch,
  isTagFilterFormModelValid,
  setStep
}) {
  const tagFilterExpression = form.get('tagFilterExpression').value;

  return (
    <Stack gap="small" align="start">
      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <JsErrorsThresholdCondition form={form} blueprintConfig={blueprintConfig} updateForm={updateForm} />
        )}
        renderCustomEvent={() => (
          <CustomEventsThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
            eumType={eumType}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
          >
            <InvalidFilterMessage
              isTagFilterFormModelValid={isTagFilterFormModelValid}
              tagFilterExpression={tagFilterExpression}
              thresholdType={thresholdType}
              setStep={setStep}
            />
          </CustomEventsThresholdCondition>
        )}
        renderSlowness={() =>
          eumType === websiteEum && (
            <SlownessThresholdCondition
              form={form}
              blueprintConfig={blueprintConfig}
              updateForm={updateForm}
              editMode={editMode}
              eumType={eumType}
              onChartViewConfigChange={onChartViewConfigChange}
              isPercentageMetric={isPercentageMetric}
            >
              <InvalidFilterMessage
                isTagFilterFormModelValid={isTagFilterFormModelValid}
                tagFilterExpression={tagFilterExpression}
                thresholdType={thresholdType}
                setStep={setStep}
              />
            </SlownessThresholdCondition>
          )
        }
        renderStatusCode={() => (
          <StatusCodeThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
            eumType={eumType}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
            ruleMetricNameOptions={
              eumType === websiteEum ? websiteRuleMetricNameOptions : mobileAppRuleMetricNameOptions
            }
            onChartViewConfigChange={onChartViewConfigChange}
          >
            <InvalidFilterMessage
              isTagFilterFormModelValid={isTagFilterFormModelValid}
              tagFilterExpression={tagFilterExpression}
              thresholdType={thresholdType}
              setStep={setStep}
            />
          </StatusCodeThresholdCondition>
        )}
        renderThroughput={() => (
          <ThroughputThresholdCondition
            form={form}
            updateForm={updateForm}
            blueprintConfig={blueprintConfig}
            editMode={editMode}
            eumType={eumType}
            ruleMetricNameOptions={
              eumType === websiteEum ? websiteRuleMetricNameOptions : mobileAppRuleMetricNameOptions
            }
            getMetricUnitPostfix={getMetricUnitPostfix}
            onChartViewConfigChange={onChartViewConfigChange}
          >
            <InvalidFilterMessage
              isTagFilterFormModelValid={isTagFilterFormModelValid}
              tagFilterExpression={tagFilterExpression}
              thresholdType={thresholdType}
              setStep={setStep}
            />
          </ThroughputThresholdCondition>
        )}
        renderCrash={() =>
          eumType === mobileAppEum && (
            <CrashThresholdCondition
              form={form}
              blueprintConfig={blueprintConfig}
              updateForm={updateForm}
              editMode={editMode}
              getMetricUnitPostfix={getMetricUnitPostfix}
              isPercentageMetric={isPercentageMetric}
              onChartViewConfigChange={onChartViewConfigChange}
            >
              <InvalidFilterMessage
                isTagFilterFormModelValid={isTagFilterFormModelValid}
                tagFilterExpression={tagFilterExpression}
                thresholdType={thresholdType}
                setStep={setStep}
              />
            </CrashThresholdCondition>
          )
        }
      />
      {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
      {thresholdType === ADAPTIVE_BASELINE && <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />}
    </Stack>
  );
}
