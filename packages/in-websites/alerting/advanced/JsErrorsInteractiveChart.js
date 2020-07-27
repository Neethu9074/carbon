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
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-websites/alerting/trackingHelpers';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import { enrichThresholdOperatorOptionsForApiConfigs } from 'in-websites/alerting/form/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { isPercentageMetric, getThresholdLabel } from 'in-websites/alerting/form/formUtils';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import { ruleMetricNameOptions } from 'in-websites/alerting/form/ruleFormData';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { findEntryByValue } from 'in-applications/alerting/form/formUtils';
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
)(JsErrorsInteractiveChart);

function JsErrorsInteractiveChart({
  form,
  onChange,
  updateForm,
  debounceOnChange$,
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

  const alertType = alertConfig.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);

  if (!blueprintConfig.isRuleComplete(alertConfig.rule)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </div>
    );
  }

  return (
    <div className={locals.container}>
      <>
        {renderThresholdCondition(
          form,
          onChange,
          blueprintConfig,
          doDebounce,
          tempThreshold,
          metricName,
          updateForm,
          percentageMetric,
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
            <AlertingBarChart
              alertConfig={alertConfig}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              alertsPreviewEnabled
              canReload
            />
          )}
        </ChartViewConfigurator>
      </>
    </div>
  );
}

export function renderThresholdCondition(
  form,
  onChange,
  blueprintConfig,
  doDebounce,
  tempThreshold,
  metricName,
  updateForm,
  percentageMetric,
  setDoDebounce,
  setTempThreshold,
  debounceOnChange$
) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = (findEntryByValue(operatorOptions, operatorValue) ?? operatorOptions[0]).label;
  const thresholdValueLabel = getThresholdLabel(form);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        asSimpleDropdown
        label={blueprintConfig.getMetricLabel(metricName)}
        defaultValue="errors"
        items={ruleMetricNameOptions.specificJsError}
        onChange={e => {
          const value = (e && e.value) || '';
          updateForm(
            form
              .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
              .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
          );
          websitesAlertingThresholdMetricChanged({ ...getBlueprintObject(form), value });
        }}
      />
      <Dropdown
        asSimpleDropdown
        name="thresholdOperator"
        label={operatorLabel}
        items={operatorOptions}
        onChange={e => {
          const value = (e && e.value) || '';
          onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
          websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value: e.value });
        }}
      />
      <Input
        id="thresholdValue"
        type="number"
        min="0"
        max={blueprintConfig.getMaxMetricValue(metricName)}
        name="thresholdValue"
        step="1"
        value={
          (doDebounce
            ? tempThreshold
            : getValueRoundedToDecimals(form.get('threshold').get('value').value, percentageMetric)) ?? 0
        }
        onChange={e => {
          let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

          if (value !== '') {
            value = percentageMetric ? round(Math.abs(value) / 100, 3) : Math.abs(value);
          }
          setDoDebounce(true);
          setTempThreshold(getValueRoundedToDecimals(value, percentageMetric));

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

JsErrorsInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
