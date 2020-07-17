import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const alertConfig = form.toJS();
  const alertType = alertConfig.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(alertConfig.rule);

  return (
    <ChartViewConfigurator
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.offset}
      framed
    >
      {chartViewConfig => (
        <>
          {isRuleComplete ? (
            <div className={locals.placeholder}>
              <AlertingBarChart
                alertConfig={alertConfig}
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
