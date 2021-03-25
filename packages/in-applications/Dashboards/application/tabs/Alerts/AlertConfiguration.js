/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription';
import { getLogMessageRuleOperatorLabel } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import { light } from 'in-themes/themes';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles//AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, applicationName = '' }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const {
    rule: { operator, alertType, message, level },
    evaluationType,
    timeThreshold,
    alertChannelIds,
    tagFilterExpression
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>Alert Configuration</ListTitle>

        <ChartViewConfiguratorWithEntitySelection
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: tagFilterFormModel
          }}
          onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          title={t('in-applications:alert.advancedModeContainer.trigger.label')}
          framed
        >
          {(chartViewConfig, applicationId, serviceId) => (
            <>
              {alertType === 'logs' && (
                <SelectedAlertTypeInfo
                  title={t('in-applications:alert.advancedModeContainer.trigger.logMessageCardTitle')}
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
              />
            </>
          )}
        </ChartViewConfiguratorWithEntitySelection>

        <ExpandableCard
          className={locals.filterListContainer}
          title={t('in-applications:alert.advancedModeContainer.scope.label')}
          useMaxAvailableHeight={false}
          openByDefault
          bodyWithoutPadding
          darkFrame
        >
          <ReadOnlyAlertEvaluation evaluationType={evaluationType} />
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
        </ExpandableCard>

        <ExpandableCard
          title={t('in-applications:alert.advancedModeContainer.timeThreshold.label')}
          useMaxAvailableHeight={false}
          bodyWithoutPadding
          openByDefault
          darkFrame
        >
          <TimeThresholdDescription timeThreshold={timeThreshold} />
        </ExpandableCard>

        <ExpandableCard
          title={t('in-applications:alert.advancedModeContainer.alertChannel.label')}
          useMaxAvailableHeight={false}
          bodyWithoutPadding
          openByDefault
          darkFrame
        >
          <div className={locals.alertChannelsWrapper}>
            <AlertChannelsViewer alertChannelIds={alertChannelIds} />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title={t('in-applications:alert.titleAlertProperties')}
          useMaxAvailableHeight={false}
          bodyWithoutPadding
          openByDefault
          darkFrame
        >
          <AlertPropertyInfos alertConfig={alertConfig} />
        </ExpandableCard>
      </LocallyChangedTheme>
    </AlertDetailsCard>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired
};

function getDescription(operator, message) {
  let description = getLogMessageRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = t('in-applications:alert.descriptionMessage', {
      description: description,
      message: message
    });
  }
  return description;
}

function getLogLevelAsList(level) {
  if (level === 'ANY') {
    return logLevelList;
  }
  return [level];
}
