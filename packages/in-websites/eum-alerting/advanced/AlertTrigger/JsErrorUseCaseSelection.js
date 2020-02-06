import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, getRuleOperatorLabel } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SelectedAlertTypeInfo from 'in-websites/eum-alerting/components/SelectedAlertTypeInfo';
import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import { modeAdvanced } from '../../constants';

import locals from './UseCaseSelection.mless';

export default function JsErrorUseCaseSelection({
  form,
  timeConfig,
  onChange,
  setJsErrorsListVisible,
  granularity,
  isReadOnly
}) {
  let chart = isReadOnly ? (
    <JsErrorsAlertingBarChart
      websiteId={form.get(fieldNames.websiteId).value}
      threshold={form.get(fieldNames.thresholdValue).value}
      operator={form.get(fieldNames.thresholdOperator).value}
      timeConfig={timeConfig}
      tagFilters={form.get(fieldNames.tagFilters).value}
      errorFilter={{
        name: 'beacon.error.message',
        operator: form.get(fieldNames.ruleOperator).value,
        stringValue: form.get(fieldNames.ruleValue).value
      }}
      metricName={form.get(fieldNames.ruleMetricName).value}
      granularity={granularity}
    />
  ) : (
    <JsErrorsChart form={form} onChange={onChange} timeConfig={timeConfig} granularity={granularity} />
  );

  if (!isReadOnly) {
    chart = <ChartContainer headline="Specific JS Errors (Selection)">{chart}</ChartContainer>;
  }

  return (
    <>
      <ExpandableCard
        title="Selected JS Error"
        label="Error rate"
        bodyWithoutPadding
        openByDefault
        darkFrame={!isReadOnly}
        framed={isReadOnly}
        headerClassName={isReadOnly && locals.cardHeader}
      >
        {isReadOnly ? (
          <SelectedAlertTypeInfo
            title="Error Message"
            description={`${getRuleOperatorLabel(form.get(fieldNames.ruleOperator).value)}: "${
              form.get(fieldNames.ruleValue).value
            }"`}
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

JsErrorUseCaseSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
