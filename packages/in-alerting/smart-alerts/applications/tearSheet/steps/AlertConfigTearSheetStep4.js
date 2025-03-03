/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Message, IconButton, Spacer } from '@instana/components';

import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdConfigPresenter';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition//ThroughputThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/StatusCodeThresholdCondition';
import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ErrorRateThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/SlownessThresholdCondition';
import TagFilterValidation from 'in-alerting/smart-alerts/applications/tearSheet/components/TagFilterValidation/TagFilterValidation';
import LogsThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/LogsThresholdCondition';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import EntitySelectionFormUpdater from 'in-alerting/smart-alerts/applications/chart/EntitySelectionFormUpdater';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import MetricDropdown from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/MetricDropdown';
import EvaluationGranularity from 'in-alerting/smart-alerts/components/tearSheet/EvaluationGranularity';
import { toAlertConfig } from 'in-alerting/smart-alerts/applications/dialog/advanced/ThresholdSection';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/tearSheet/GracePeriodWrapper';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep4.mless';

const scopeSelectionTimeConfig = {
  windowSize: days.toMillis(1)
};

export default function AlertConfigTearSheetStep4(props) {
  const {
    form,
    updateForm,
    editMode,
    onChange,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    isGlobalSmartAlert,
    thresholdResult,
    isTagFilterFormModelValid,
    setStep
  } = props;

  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;

  const blueprintConfig = getBlueprintConfig(alertType);

  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(toAlertConfig(form));

  const { QueryBuilder } = useMemo(() => {
    return createBoundedAlertQueryBuilder(
      applications,
      boundaryScope,
      scopeSelectionTimeConfig,
      thresholdType,
      alertType
    );
  }, [applications, boundaryScope, thresholdType, alertType]);
  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.applications.tearSheet.threshold.title')}
          description={t('in-alerting:smartAlerts.applications.tearSheet.threshold.description')}
          hideSpace
        >
          <div className={classNames({ [locals.container]: true, [locals.alignCenter]: true })}>
            <span className={locals.label}>
              <AlertTypography
                variant="body-regular"
                color="color900"
                content={t('in-alerting:smartAlerts.details.metricTitle')}
              />
            </span>
            <MetricDropdown
              alertType={alertType}
              form={form}
              updateForm={updateForm}
              blueprintConfig={blueprintConfig}
            />
          </div>

          <div className={classNames({ [locals.container]: true, [locals.alignStart]: true })} id="selectType">
            <span className={locals.longLabel}>
              <AlertTypography
                variant="body-regular"
                color="color900"
                content={t('in-alerting:smartAlerts.details.thresholdTypeTitle')}
              />
            </span>

            <StaticOrAdaptiveSwitch
              form={form}
              setForm={updateForm}
              onThresholdTypeChange={onThresholdTypeChange}
              isTearSheet
              isDisabled={!blueprintConfig?.baselineEnabled}
              bluePrint={blueprintConfig.name}
              editMode={editMode}
            />
          </div>

          {isTagFilterFormModelValid === false && tagFilterExpression && thresholdType === ADAPTIVE_BASELINE && (
            <div className={locals.filterSection}>
              <Message
                type="warning"
                inline
                fullInlineWidth
                title={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilters')}
                description={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilterWarning')}
              />
              <IconButton
                alignment="right"
                kind="tertiary"
                type="lib_actions_edit"
                onClick={() =>
                  addActiveDialog(
                    <TagFilterValidation
                      form={form}
                      close={close}
                      QueryBuilder={QueryBuilder}
                      updateForm={updateForm}
                      setStep={setStep}
                    />
                  )
                }
              />
            </div>
          )}
          {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
          {thresholdType === ADAPTIVE_BASELINE && <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />}
          {!ruleComplete ? (
            <>
              <Spacer vertical="xsmall" />
              <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} isTearSheet />
            </>
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
          <EvaluationGranularity
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={
              thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
            }
            thresholdType={thresholdType}
            titleWidth="4.5rem"
          />
        </TearSheetStepTitleWrapper>
        <span className={locals.seperator} />
        <TearSheetStepTitleWrapper
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
          <Spacer size="gutter" />
          <GracePeriodWrapper form={form} updateForm={updateForm} />
        </TearSheetStepTitleWrapper>
      </div>

      <EntitySelectionFormUpdater form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert}>
        <ChartViewConfiguratorWithEntitySelection
          alertConfigWithFormModel={alertConfigWithFormModel}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          headerTransparent
          isTearSheet
          sectionHeader={
            <TearSheetStepTitleWrapper
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
              isTearSheet
            />
          )}
        </ChartViewConfiguratorWithEntitySelection>
      </EntitySelectionFormUpdater>
    </>
  );
}
