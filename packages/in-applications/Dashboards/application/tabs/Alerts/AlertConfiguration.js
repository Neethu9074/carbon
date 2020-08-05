import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import { getLogMessageRuleOperatorLabel } from 'in-applications/alerting/form/ruleFormData';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
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
    timeThreshold,
    alertChannelIds,
    tagFilters
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>Alert Configuration</ListTitle>

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

              <AlertingChart alertConfig={alertConfig} viewConfig={chartViewConfig} blueprintConfig={blueprintConfig} />
            </>
          )}
        </ChartViewConfigurator>

        <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame useMaxAvailableHeight={false}>
          <div className={locals.filterList}>
            <TagFilterListPresenter
              tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters],
                applicationName
              })}
              disabled
            />
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          </div>
        </ExpandableCard>

        <ExpandableCard title="Time Threshold" openByDefault bodyWithoutPadding darkFrame useMaxAvailableHeight={false}>
          <TimeThresholdDescription timeThreshold={timeThreshold} />
        </ExpandableCard>

        <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding useMaxAvailableHeight={false}>
          <div className={locals.alertChannelsWrapper}>
            <AlertChannelsViewer alertChannelIds={alertChannelIds} />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Alert Properties"
          openByDefault
          bodyWithoutPadding
          darkFrame
          useMaxAvailableHeight={false}
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
