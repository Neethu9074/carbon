import { compose, withState } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getThresholdValueForPercentageMetric,
  getValueRoundedToDecimals,
  round
} from 'in-new-components/Alerting/utils/formatUtils';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-applications/alerting/form/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import getErrorRateChartConfig from 'in-applications/alerting/data/chartConfigForErrorRate';
import { ruleMetricNameOptions } from 'in-applications/alerting/form/ruleFormData';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
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
)(ErrorRateInteractiveChart);

function ErrorRateInteractiveChart({
  form,
  onChange,
  debounceOnChange$,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

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
        setTempThreshold,
        setDoDebounce,
        debounceOnChange$
      )}

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingBarChart
            chartConfigForBlueprint={getErrorRateChartConfig({
              applicationId: form.get('applicationId').value,
              viewConfig: chartViewConfig,
              tagFilters: form.get('tagFilters').value,
              granularity: granularity,
              threshold: threshold,
              timeThreshold: form.get('timeThreshold').toJS(),
              boundaryScope: form.get('boundaryScope').value,
              alertsPreviewEnabled: true
            })}
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
  setTempThreshold,
  setDoDebounce,
  debounceOnChange$
) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = operatorOptions.find(op => op.value === operatorValue)?.label;

  const thresholdValueLabel = getThresholdLabel(form);

  return (
    <ThresholdConditionFormGroup>
      <Label id="errorRate" name="errorRate">
        {ruleMetricNameOptions.errorRate[0].label}
      </Label>
      <Dropdown
        asSimpleDropdown
        name="thresholdOperator"
        label={operatorLabel}
        items={operatorOptions}
        onChange={({ value = '' }) => {
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
          applicationsAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
        }}
      />
      <Input
        id="thresholdValue"
        className={locals.narrowControl}
        type="number"
        min="0"
        max="100"
        name="thresholdValue"
        step="1"
        value={
          (doDebounce ? tempThreshold : getValueRoundedToDecimals(form.get('threshold').get('value').value, true)) ?? 0
        }
        onChange={e => {
          let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

          if (value !== '') {
            value = round(Math.abs(value) / 100, 3);
          }
          setTempThreshold(getValueRoundedToDecimals(value, true));
          setDoDebounce(true);

          const onChangCallback = () => {
            onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
            setDoDebounce(false);
          };

          debounceOnChange$.emit(onChangCallback.bind(this));
          debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
        }}
      />
      {thresholdValueLabel !== 'Value' && <Label htmlFor="thresholdValue">{thresholdValueLabel}</Label>}
    </ThresholdConditionFormGroup>
  );
}

ErrorRateInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
