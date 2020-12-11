import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ReadOnlyAlertEvaluation from 'in-applications/alerting/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import { PER_AP } from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import { getLogMessageRuleOperatorLabel } from 'in-applications/alerting/form/ruleFormData';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import { light } from 'in-themes/themes';

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
  const tagFilterExpressionUiModel = fromBackendModel(tagFilterExpression);
  const isPerApAlert = evaluationType === PER_AP;

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>Alert Configuration</ListTitle>

        {!isPerApAlert && (
          <ChartViewConfigurator
            onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            className={locals.chartContainer}
            title="Trigger"
            framed
          >
            {() => (
              <div style={{ height: 230 }}>
                <strong>Chart Placeholder</strong>. For this type of config we can not render the alerting chart yet.
              </div>
            )}
          </ChartViewConfigurator>
        )}

        {isPerApAlert && (
          <ChartViewConfigurator
            onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            className={locals.chartContainer}
            title="Trigger"
            framed
          >
            {chartViewConfig => (
              <>
                {alertType === 'logs' && (
                  <SelectedAlertTypeInfo
                    title="Log Message"
                    description={getDescription(operator, message)}
                    badges={getLogLevelAsList(level)}
                  />
                )}

                <AlertingChartWithErrorMessage
                  alertConfig={{
                    ...alertConfig,
                    tagFilterExpression: tagFilterExpressionUiModel
                  }}
                  viewConfig={chartViewConfig}
                  blueprintConfig={blueprintConfig}
                />
              </>
            )}
          </ChartViewConfigurator>
        )}

        <ExpandableCard
          className={locals.filterListContainer}
          title="Scope"
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
                      tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                }
                tagFilterExpressionUiModel={tagFilterExpressionUiModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterExpressionUiModel} readOnly />}
                convertedTagFilterExpression={convertedTagFilterExpression}
                iconLabelConfig={{
                  text: applicationName,
                  type: 'lib_application'
                }}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          </div>
        </ExpandableCard>

        <ExpandableCard title="Time Threshold" useMaxAvailableHeight={false} bodyWithoutPadding openByDefault darkFrame>
          <TimeThresholdDescription timeThreshold={timeThreshold} />
        </ExpandableCard>

        <ExpandableCard title="Alert Channels" useMaxAvailableHeight={false} bodyWithoutPadding openByDefault darkFrame>
          <div className={locals.alertChannelsWrapper}>
            <AlertChannelsViewer alertChannelIds={alertChannelIds} />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Alert Properties"
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
