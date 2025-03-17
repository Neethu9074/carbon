/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import toAlertConfigWithRules from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const alertConfigWithFormModel = toAlertConfigWithRules(form);
  const alertType = alertConfigWithFormModel.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule);
  const threshold = alertConfigWithFormModel.rules[0].thresholds.WARNING;
  const chartViewConfigs =
    threshold?.type && isAdaptiveBaselineConfig(threshold) ? [chartViewConfig24hours] : defaultChartViewConfigs;

  return (
    <ChartViewConfigurator
      onChartViewConfigChange={onChartViewConfigChange}
      chartViewConfigs={chartViewConfigs}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.position}
      framed
    >
      {chartViewConfig => (
        <>
          {isRuleComplete ? (
            <div className={locals.placeholder}>
              <WebsitesAlertingChartWithErrorMessage
                alertConfigWithFormModel={alertConfigWithFormModel}
                viewConfig={chartViewConfig}
                blueprintConfig={blueprintConfig}
                alertsPreviewEnabled
                canReload
              />
            </div>
          ) : (
            <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
          )}
        </>
      )}
    </ChartViewConfigurator>
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
