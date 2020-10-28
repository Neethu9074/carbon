import { compose, withState } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getThresholdValueForPercentageMetric,
  getValueRoundedToDecimals,
  round
} from 'in-new-components/Alerting/utils/formatUtils';
import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getMetricUnitPostfix } from 'in-applications/alerting/form/formUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import { isNotBlank } from 'in-services/util/string';
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
  blueprintConfig,
  form,
  onChange,
  debounceOnChange$,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

  const alertConfig = {
    ...form.toJS(),
    threshold: {
      ...form.get('threshold').toJS(),
      value:
        (doDebounce
          ? getThresholdValueForPercentageMetric(tempThreshold, true)
          : form.get('threshold').get('value').value) || 0
    }
  };

  return (
    <div className={locals.container}>
      <ThresholdCondition
        {...{
          form,
          onChange,
          blueprintConfig,
          doDebounce,
          tempThreshold,
          setDoDebounce,
          setTempThreshold,
          debounceOnChange$
        }}
      />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChart
            alertConfig={alertConfig}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

export function ThresholdCondition({
  form,
  onChange,
  blueprintConfig,
  doDebounce,
  tempThreshold,
  setDoDebounce,
  setTempThreshold,
  debounceOnChange$
}) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = operatorOptions.find(op => op.value === operatorValue)?.label;

  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Label id="errorRate" name="errorRate">
        {blueprintConfig.getMetricLabel(metricName)}
      </Label>
      <Dropdown
        asSimpleDropdown
        label={operatorLabel}
        items={operatorOptions}
        onChange={({ value = '' }) => {
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
          applicationsAlertingThresholdOperatorChanged(getTrackingObject(form, { value }));
        }}
      />
      <Input
        id="thresholdValue"
        className={locals.narrowControl}
        type="number"
        min="0"
        max={maxValue}
        name="thresholdValue"
        step="1"
        value={
          (doDebounce ? tempThreshold : getValueRoundedToDecimals(form.get('threshold').get('value').value, true)) ?? 0
        }
        onChange={({ target }) => {
          if (target.value > maxValue) return;
          const value = target.value == '' ? '' : round(Math.abs(target.value) / 100, 3);

          setTempThreshold(getValueRoundedToDecimals(value, true));
          setDoDebounce(true);

          const onChangCallback = () => {
            onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
            setDoDebounce(false);
          };

          debounceOnChange$.emit(onChangCallback.bind(this));
          debouncedThresholdValueChangedTracker(getTrackingObject(form, { value }));
        }}
      />
      {isNotBlank(metricUnitPostfix) && <Label htmlFor="thresholdValue">{metricUnitPostfix}</Label>}
    </ThresholdConditionFormGroup>
  );
}

ErrorRateInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  blueprintConfig: blueprintConfigPropType,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
