/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ThroughputThresholdCondition from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThroughputThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/StatusCodeThresholdCondition';
import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ErrorRateThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/SlownessThresholdCondition';
import LogsThresholdCondition from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/LogsThresholdCondition';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdConfigPresenter';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import EntitySelectionFormUpdater from 'in-alerting/smart-alerts/applications/chart/EntitySelectionFormUpdater';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep4.mless';

export default function AlertConfigTearSheetStep4(props) {
  const {
    form,
    updateForm,
    editMode,
    onChange,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    isGlobalSmartAlert,
    thresholdResult
  } = props;

  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;

  const blueprintConfig = getBlueprintConfig(alertType);

  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(form.toJS());

  return (
    <>
      <div className={locals.container40_60}>
        <TearSheetStepContentWrapper
          headline={t('in-alerting:smartAlerts.applications.tearSheet.threshold.title')}
          description={t('in-alerting:smartAlerts.applications.tearSheet.threshold.description')}
        >
          {blueprintConfig?.baselineEnabled && (
            <div className={locals.container}>
              <span className={locals.label}>Threshold Type</span>
              <StaticOrAdaptiveSwitch
                form={form}
                setForm={updateForm}
                onThresholdTypeChange={onThresholdTypeChange}
                isTearSheet
              />
            </div>
          )}

          {!ruleComplete ? (
            <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
          ) : (
            <AlertTypeSwitch
              isGlobalSmartAlert={isGlobalSmartAlert}
              alertType={alertType}
              blueprintConfig={blueprintConfig}
              editMode={editMode}
              form={form}
              updateForm={updateForm}
              renderErrorRate={props => <ErrorRateThresholdCondition {...props} />}
              renderSlowness={props => <SlownessThresholdCondition {...props} />}
              renderLogs={props => <LogsThresholdCondition {...props} />}
              renderStatusCode={props => <StatusCodeThresholdCondition {...props} />}
              renderThroughput={props => <ThroughputThresholdCondition {...props} />}
            />
          )}
          {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
          {thresholdType === ADAPTIVE_BASELINE && <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />}
        </TearSheetStepContentWrapper>
        <TearSheetStepContentWrapper
          headline={t('in-alerting:smartAlerts.applications.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.applications.tearSheet.timeThreshold.description')}
        >
          <TimeThresholdConfigPresenter
            form={form}
            onChange={onChange}
            updateForm={updateForm}
            impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
            hasTraceImpactOption
            oneMinuteGranularityAllowed={
              thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
            }
          />
        </TearSheetStepContentWrapper>
      </div>

      <EntitySelectionFormUpdater form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert}>
        <ChartViewConfiguratorWithEntitySelection
          alertConfigWithFormModel={alertConfigWithFormModel}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          headerTransparent
          isTearSheet
          sectionHeader={
            <TearSheetStepContentWrapper
              headline={t('in-alerting:smartAlerts.applications.tearSheet.alertChart.title')}
              description={t('in-alerting:smartAlerts.applications.tearSheet.alertChart.description')}
              hidePadding
            />
          }
        >
          {(chartViewConfig, applicationId, serviceId, endpointId) => (
            <ApplicationAlertingChartWithErrorMessage
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              alertConfigWithFormModel={alertConfigWithFormModel}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              alertsPreviewEnabled
              canReload
            />
          )}
        </ChartViewConfiguratorWithEntitySelection>
      </EntitySelectionFormUpdater>
    </>
  );
}
