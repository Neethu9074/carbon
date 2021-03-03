/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-applications/alerting/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ApplicationAlertingChartWithErrorMessage from 'in-applications/alerting/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ReadOnlyAlertEvaluation from 'in-applications/alerting/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import { getLogMessageRuleOperatorLabel } from 'in-applications/alerting/form/ruleFormData';
import ApplicationScopePath from 'in-applications/alerting/components/ApplicationScopePath';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import { light } from 'in-themes/themes';
import { t } from 'in-i18n';

import locals from 'in-new-components/Alerting/shared-styles/AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, applicationName }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const {
    rule: { operator, alertType, message, level },
    evaluationType,
    timeThreshold,
    alertChannelIds,
    tagFilters, // QB1
    tagFilterExpression, // QB2
    convertedTagFilterExpression // QB2
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>Alert Configuration</ListTitle>

        <ChartViewConfigurator
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: tagFilterFormModel
          }}
          onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          title={t('in-applications:alert.advancedModeContainer.trigger.label')}
          framed
        >
          {(chartViewConfig, serviceId) => (
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
                serviceId={serviceId}
              />
            </>
          )}
        </ChartViewConfigurator>

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
                tagFilterList={
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName,
                      tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                }
                tagFilterFormModel={tagFilterFormModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                convertedTagFilterExpression={convertedTagFilterExpression}
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
