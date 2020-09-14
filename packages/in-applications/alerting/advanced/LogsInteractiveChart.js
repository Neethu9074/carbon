import { compose, withState } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdGreaterOperatorOptions
} from 'in-new-components/Alerting/advanced/thresholdFormData';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { findEntryByValue } from 'in-new-components/Alerting/utils/formUtils';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
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
      value: (doDebounce ? tempThreshold : form.get('threshold').get('value').value) || 0
    }
  };

  if (!blueprintConfig.isRuleComplete(alertConfig.rule)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </div>
    );
  }

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
  const operatorLabel =
    findEntryByValue(operatorOptions, operatorValue)?.label ?? thresholdGreaterOperatorOptions[0].label;

  const thresholdValueLabel = getThresholdLabel(form);
  const metricName = form.get('rule').get('metricName').value;

  return (
    <ThresholdConditionFormGroup>
      <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
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
        type="number"
        min="0"
        name="thresholdValue"
        step="1"
        value={(doDebounce ? tempThreshold : form.get('threshold').get('value').value) ?? 0}
        onChange={({ target }) => {
          const value = target.value == '' ? '' : Math.abs(target.value);

          setDoDebounce(true);
          setTempThreshold(value);

          const onChangCallback = () => {
            onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
            setDoDebounce(false);
          };

          debounceOnChange$.emit(onChangCallback.bind(this));
          debouncedThresholdValueChangedTracker(getTrackingObject(form, { value }));
        }}
      />
      {thresholdValueLabel !== 'Count' && <Label htmlFor="thresholdValue">{thresholdValueLabel}</Label>}
    </ThresholdConditionFormGroup>
  );
}

LogsInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
