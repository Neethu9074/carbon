/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { getLogMessageRuleOperatorLabel } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import useApplicationLabel from 'in-alerting/smart-alerts/applications/hooks/useApplicationLabel';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import CustomPayloadCard from 'in-alerting/smart-alerts/applications/details/CustomPayloadCard';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, isGlobalSmartAlert }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const applicationName = useApplicationLabel(firstApplicationId(alertConfig.applications), isGlobalSmartAlert);

  const {
    rule: { operator, alertType, message, level },
    evaluationType,
    timeThreshold,
    alertChannelIds,
    tagFilterExpression,
    customPayloadFields
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.applications.alertConfiguration')} </ListTitle>

      <ChartViewConfiguratorWithEntitySelection
        alertConfigWithFormModel={{
          ...alertConfig,
          tagFilterExpression: tagFilterFormModel
        }}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label')}
        doNotSetDefaultHeight
        framed
      >
        {(chartViewConfig, applicationId, serviceId, endpointId) => (
          <>
            {alertType === 'logs' && (
              <SelectedAlertTypeInfo
                title={t(
                  'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.logMessageCardTitle'
                )}
                description={getDescription(operator, message)}
                badges={getLogLevelAsList(level)}
              />
            )}

            <ApplicationAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
            />
          </>
        )}
      </ChartViewConfiguratorWithEntitySelection>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.label')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.evaluationType}>
          <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
        </div>
        <div className={locals.paddingBodyWrapper}>
          <div className={locals.alertFiltersWrapper}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              scopePath={
                <ApplicationScopePath boundaryScope={alertConfig.boundaryScope} applicationName={applicationName} />
              }
            />
          </div>
          <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          <ReadOnlyIncludeInternalOrSyntheticCallsSwitch alertConfig={alertConfig} />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.alertChannel.label')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.details.titleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos
          alertConfig={alertConfig}
          renderCustomTitle={() => <AlertTitleWithPlaceholderHighlighting configName={alertConfig.name} />}
        />
      </ExpandableLightCard>
      <CustomPayloadCard customPayloadFields={customPayloadFields} />
    </AlertDetailsCard>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  isGlobalSmartAlert: PropTypes.bool
};

function getDescription(operator, message) {
  let description = getLogMessageRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${message}"`;
  }
  return description;
}

function getLogLevelAsList(level) {
  if (level === 'ANY') {
    return logLevelList;
  }
  return [level];
}
