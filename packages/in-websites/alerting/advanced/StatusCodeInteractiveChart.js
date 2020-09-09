import { compose, withState } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getThresholdValueForPercentageMetric,
  getValueRoundedToDecimals,
  round
} from 'in-new-components/Alerting/utils/formatUtils';
import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged
} from 'in-websites/alerting/tracker';
import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { debouncedThresholdValueChangedTracker } from 'in-websites/alerting/trackingHelpers';
import { isPercentageMetric, getThresholdLabel } from 'in-websites/alerting/form/formUtils';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { ruleMetricNameOptions } from 'in-websites/alerting/form/ruleFormData';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(StatusCodeInteractiveChart);

function StatusCodeInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  debounceOnChange$,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

  const metricName = form.get('rule').get('metricName').value;
  const percentageMetric = isPercentageMetric(metricName);
  const alertConfig = {
    ...form.toJS(),
    threshold: {
      ...form.get('threshold').toJS(),
      value:
        (doDebounce
          ? getThresholdValueForPercentageMetric(tempThreshold, percentageMetric)
          : form.get('threshold').get('value').value) || 0
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
          metricName,
          percentageMetric,
          updateForm,
          doDebounce,
          tempThreshold,
          setTempThreshold,
          setDoDebounce,
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
  metricName,
  percentageMetric,
  updateForm,
  doDebounce,
  tempThreshold,
  setTempThreshold,
  setDoDebounce,
  debounceOnChange$
}) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = (operatorOptions.find(op => op.value === operatorValue) ?? operatorOptions[0]).label;

  const thresholdValueLabel = getThresholdLabel(form);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        asSimpleDropdown
        label={blueprintConfig.getMetricLabel(metricName)}
        items={ruleMetricNameOptions.statusCode}
        onChange={({ value = '' }) => {
          updateForm(
            form
              .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
              .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
          );

          websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
        }}
      />
      <Dropdown
        asSimpleDropdown
        label={operatorLabel}
        items={operatorOptions}
        onChange={({ value = '' }) => {
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
          websitesAlertingThresholdOperatorChanged(getTrackingObject(form, { value }));
        }}
      />
      <Input
        id="thresholdValue"
        className={locals.narrowControl}
        type="number"
        min="0"
        max={blueprintConfig.getMaxMetricValue(metricName)}
        name="thresholdValue"
        step="1"
        value={
          doDebounce
            ? tempThreshold
            : getValueRoundedToDecimals(form.get('threshold').get('value').value, percentageMetric)
        }
        onChange={({ target }) => {
          let value = '';
          if (target.value !== '') {
            value = percentageMetric ? round(Math.abs(target.value) / 100, 3) : Math.abs(target.value);
          }

          setDoDebounce(true);
          setTempThreshold(getValueRoundedToDecimals(value, percentageMetric));

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

StatusCodeInteractiveChart.propTypes = {
  form: PropTypes.object.isRequired,
  blueprintConfig: blueprintConfigPropType,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  debounceOnChange$: PropTypes.object,
  updateForm: PropTypes.func.isRequired
};
