import { compose, withState } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-applications/alerting/form/thresholdFormData';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { getThresholdValueForPercentageMetric } from 'in-new-components/Alerting/utils/formatUtils';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { findEntryByValue, getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import LogsAlertingBarChart from 'in-applications/alerting/chart/LogsAlertingBarChart';
import { ruleMetricNameOptions } from 'in-applications/alerting/form/ruleFormData';
import Dropdown from 'in-new-components/Dropdown';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(LogsInteractiveChart);

function LogsInteractiveChart({
  form,
  onChange,
  debounceOnChange$,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

  if (!hasLogMessageSelected(form)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message="Please select a Log Message to see when this alert triggers" />
      </div>
    );
  }

  const threshold = {
    ...form.get('threshold').toJS(),
    value:
      (doDebounce
        ? getThresholdValueForPercentageMetric(tempThreshold, true)
        : form.get('threshold').get('value').value) || 0
  };
  const granularity = form.get('granularity').value;

  return (
    <div className={locals.container}>
      {renderThresholdCondition(
        form,
        onChange,
        doDebounce,
        tempThreshold,
        setDoDebounce,
        setTempThreshold,
        debounceOnChange$
      )}

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <LogsAlertingBarChart
            applicationId={form.get('applicationId').value}
            logMessage={form.get('rule').get('message').value}
            logMessageOperator={form.get('rule').get('operator').value}
            logLevel={form.get('rule').get('level').value}
            viewConfig={chartViewConfig}
            tagFilters={form.get('tagFilters').value}
            granularity={granularity}
            threshold={threshold}
            timeThreshold={form.get('timeThreshold').toJS()}
            boundaryScope={form.get('boundaryScope').value}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

export function renderThresholdCondition(
  form,
  onChange,
  doDebounce,
  tempThreshold,
  setDoDebounce,
  setTempThreshold,
  debounceOnChange$
) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = findEntryByValue(operatorOptions, operatorValue)?.label ?? thresholdOperatorOptions[0].label;

  const thresholdValueLabel = getThresholdLabel(form);

  return (
    <ThresholdConditionFormGroup>
      <Label>{ruleMetricNameOptions.logs[0].label}</Label>
      <Dropdown
        asSimpleDropdown
        name="thresholdOperator"
        label={operatorLabel}
        items={operatorOptions}
        onClick={e => {
          const value = (e && e.value) || '';
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
          applicationsAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
        }}
      />
      <Input
        id="thresholdValue"
        type="number"
        min="0"
        name="thresholdValue"
        step="1"
        value={(doDebounce ? tempThreshold : form.get('threshold').get('value').value) ?? 0}
        onChange={e => {
          let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

          setDoDebounce(true);
          setTempThreshold(value);

          const onChangCallback = () => {
            onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
            setDoDebounce(false);
          };

          debounceOnChange$.emit(onChangCallback.bind(this));
          debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
        }}
      />
      {thresholdValueLabel !== 'Count' && <Label htmlFor="thresholdValue">{thresholdValueLabel}</Label>}
    </ThresholdConditionFormGroup>
  );
}

LogsInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};

function hasLogMessageSelected(form) {
  return !!(form && form.get('rule').get('message').value);
}
