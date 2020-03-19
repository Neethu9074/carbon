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
} from 'in-websites/eum-alerting/tracker';
import { fieldNames, hiddenFieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-websites/eum-alerting/trackingHelpers';
import IncompleteChartPlaceholder from 'in-websites/eum-alerting/components/IncompleteChartPlaceholder';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { getThresholdLabel, isPercentageMetric } from 'in-websites/eum-alerting/formHelpers';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { errorCount, errorRate } from 'in-websites/eum-alerting/constants';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from './InteractiveChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(JsErrorsInteractiveChart);

function JsErrorsInteractiveChart({ form, timeConfig, onChange, granularity, debounceOnChange$ }) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get(fieldNames.thresholdValue).value);
  const [doDebounce, setDoDebounce] = useState(false);

  const metricName = form.get(fieldNames.ruleMetricName).value;
  const percentageMetric = isPercentageMetric(metricName);

  const threshold = {
    ...getThreshold(form),
    value:
      (doDebounce
        ? getThresholdValueForPercentageMetric(tempThreshold, percentageMetric)
        : form.get(fieldNames.thresholdValue).value) || 0
  };

  return (
    <div className={locals.container}>
      {hasJsErrorSelected(form) ? (
        <>
          <div className={locals.controls}>
            <FormGroup>
              <Label htmlFor={fieldNames.ruleMetricName}>Metric</Label>
              <ComboBox
                id={fieldNames.ruleMetricName}
                className={locals.wideControl}
                name={fieldNames.ruleMetricName}
                value={metricName}
                options={selectOptions[fieldNames.ruleMetricName][alertTypes.specificJsError]}
                onChange={e => {
                  const value = (e && e.value) || '';
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };

                  onChange(form, fieldNames.ruleMetricName, value, doCalculateThresholdOnBackend);
                  websitesAlertingThresholdMetricChanged({ ...getBlueprintObject(form), value });
                }}
                defaultValue={errorCount}
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor={fieldNames.thresholdOperator}>Operator</Label>
              <ComboBox
                id={fieldNames.thresholdOperator}
                className={locals.narrowControl}
                name={fieldNames.thresholdOperator}
                value={form.get(fieldNames.thresholdOperator).value}
                options={selectOptions[fieldNames.thresholdOperator]}
                onChange={e => {
                  const value = (e && e.value) || '';
                  onChange(form, fieldNames.thresholdOperator, value);
                  websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
                }}
                defaultValue={selectOptions[fieldNames.thresholdOperator][0].value}
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor={fieldNames.thresholdValue}>{getThresholdLabel(form)}</Label>
              <Input
                id={fieldNames.thresholdValue}
                className={locals.narrowControl}
                type="number"
                min="0"
                max={getMaxThresholdValue(metricName)}
                name={fieldNames.thresholdValue}
                step="1"
                value={
                  doDebounce
                    ? tempThreshold
                    : getValueRoundedToDecimals(form.get(fieldNames.thresholdValue).value, percentageMetric)
                }
                onChange={e => {
                  let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

                  if (value !== '') {
                    value = percentageMetric ? round(Math.abs(value) / 100, 3) : Math.abs(value);
                  }
                  setDoDebounce(true);
                  setTempThreshold(getValueRoundedToDecimals(value, percentageMetric));

                  const onChangCallback = () => {
                    onChange(form, fieldNames.thresholdValue, value);
                    setDoDebounce(false);
                  };

                  debounceOnChange$.emit(onChangCallback.bind(this));
                  debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
                }}
              />
            </FormGroup>
          </div>

          <ChartContainer headline="Last 24 hours">
            <JsErrorsAlertingBarChart
              websiteId={form.get(fieldNames.websiteId).value}
              timeConfig={timeConfig}
              tagFilters={form.get(fieldNames.tagFilters).value}
              errorFilter={{
                name: 'beacon.error.message',
                operator: form.get(fieldNames.ruleOperator).value,
                stringValue: form.get(fieldNames.ruleValue).value
              }}
              metricName={metricName}
              granularity={granularity}
              threshold={threshold}
              timeThreshold={getTimeThreshold(form)}
              alertsPreviewEnabled
              canReload
            />
          </ChartContainer>
        </>
      ) : (
        <IncompleteChartPlaceholder message="Please select a JS Error to see when this alert triggers" />
      )}
    </div>
  );
}

JsErrorsInteractiveChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  debounceOnChange$: PropTypes.object
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.ruleValue).value);
}

function getMaxThresholdValue(metricName) {
  return isRateMetric(metricName) ? 100 : undefined;
}

function isRateMetric(metricName) {
  return metricName === errorRate;
}
