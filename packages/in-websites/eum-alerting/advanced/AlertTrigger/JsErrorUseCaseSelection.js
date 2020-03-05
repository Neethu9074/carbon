import PropTypes from 'prop-types';
import React from 'react';

import {
  fieldNames,
  getMetricLabel,
  getRuleOperatorLabel
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SelectedAlertTypeInfo from 'in-websites/eum-alerting/components/SelectedAlertTypeInfo';
import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import { modeAdvanced } from 'in-websites/eum-alerting/constants';
import { operators } from 'in-analyze/applicationFilter';

import locals from './UseCaseSelection.mless';

export default function JsErrorUseCaseSelection({
  form,
  timeConfig,
  onChange,
  setJsErrorsListVisible,
  granularity,
  isReadOnly
}) {
  const metricName = form.get(fieldNames.ruleMetricName).value;
  let chart = isReadOnly ? (
    <JsErrorsAlertingBarChart
      websiteId={form.get(fieldNames.websiteId).value}
      timeConfig={timeConfig}
      tagFilters={form.get(fieldNames.tagFilters).value}
      errorFilter={{
        name: 'beacon.error.message',
        operator: form.get(fieldNames.ruleOperator).value,
        stringValue: form.get(fieldNames.ruleValue).value
      }}
      metricName={form.get(fieldNames.ruleMetricName).value}
      granularity={granularity}
      threshold={getThreshold(form)}
      timeThreshold={getTimeThreshold(form)}
      alertsPreviewEnabled
    />
  ) : (
    <JsErrorsChart form={form} onChange={onChange} timeConfig={timeConfig} granularity={granularity} />
  );

  return (
    <>
      <ExpandableCard
        title="Selected JS Error"
        label={getMetricLabel(alertTypes.specificJsError, metricName)}
        bodyWithoutPadding
        openByDefault
        darkFrame={!isReadOnly}
        framed={isReadOnly}
        headerClassName={isReadOnly && locals.cardHeader}
      >
        {isReadOnly ? (
          <SelectedAlertTypeInfo
            title="Error Message"
            description={getDescription(form)}
            svgIconType="lib_help_error_warning"
          />
        ) : (
          <ProvideManualPattern
            form={form}
            timeConfig={timeConfig}
            onChange={onChange}
            onSelectJsError={setJsErrorsListVisible}
            mode={modeAdvanced}
          />
        )}
      </ExpandableCard>
      <div className={locals.chartContainer}>{chart}</div>
    </>
  );
}

function getDescription(form) {
  const operator = form.get(fieldNames.ruleOperator).value;
  let description = getRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${form.get(fieldNames.ruleValue).value}"`;
  }
  return description;
}

JsErrorUseCaseSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
