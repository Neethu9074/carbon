import { withState, compose } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getThresholdValueForPercentageMetric,
  getValueRoundedToDecimals,
  round
} from 'in-new-components/Alerting/utils/formatUtils';
import {
  thresholdOperatorOptions,
  enrichThresholdOperatorOptionsForApiConfigs
} from 'in-websites/alerting/form/thresholdFormData';
import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged
} from 'in-websites/alerting/tracker';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-websites/alerting/trackingHelpers';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import StatusCodeAlertingBarChart from 'in-websites/alerting/chart/StatusCodeAlertingBarChart';
import { isPercentageMetric, getThresholdLabel } from 'in-websites/alerting/form/formUtils';
import { statusCodeCount, statusCodeRate } from 'in-websites/alerting/constants';
import { ruleMetricNameOptions } from 'in-websites/alerting/form/ruleFormData';
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
)(StatusCodeInteractiveChart);

function StatusCodeInteractiveChart({
  form,
  onChange,
  debounceOnChange$,
  updateForm,
  onChartConfigChange,
  indexInitialSelectedTimeConfig
}) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

  const metricName = form.get('rule').get('metricName').value;
  const percentageMetric = isPercentageMetric(metricName);

  const threshold = {
    ...form.get('threshold').toJS(),
    value:
      (doDebounce
        ? getThresholdValueForPercentageMetric(tempThreshold, percentageMetric)
        : form.get('threshold').get('value').value) || 0
  };

  return (
    <div className={locals.container}>
      <div className={locals.controls}>
        <FormGroup>
          <Label htmlFor={'ruleMetricName'}>Metric</Label>
          <ComboBox
            id={'ruleMetricName'}
            className={locals.wideControl}
            name={'ruleMetricName'}
            value={metricName}
            options={ruleMetricNameOptions.statusCode}
            onChange={e => {
              const value = (e && e.value) || '';

              updateForm(
                form
                  .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );

              websitesAlertingThresholdMetricChanged({ ...getBlueprintObject(form), value });
            }}
            defaultValue={statusCodeCount}
            clearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="thresholdOperator">Operator</Label>
          <ComboBox
            id="thresholdOperator"
            className={locals.narrowControl}
            name="thresholdOperator"
            value={form.get('threshold').get('operator').value}
            options={enrichThresholdOperatorOptionsForApiConfigs(form.get('threshold').get('operator').value)}
            onChange={e => {
              const value = (e && e.value) || '';
              onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
              websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
            }}
            defaultValue={thresholdOperatorOptions[0].value}
            clearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="thresholdValue">{getThresholdLabel(form)}</Label>
          <Input
            id="thresholdValue"
            className={locals.narrowControl}
            type="number"
            min="0"
            max={getMaxThresholdValue(metricName)}
            name="thresholdValue"
            step="1"
            value={
              doDebounce
                ? tempThreshold
                : getValueRoundedToDecimals(form.get('threshold').get('value').value, percentageMetric)
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
        </FormGroup>
      </div>

      <ChartViewConfigurator
        className={locals.chartContainer}
        onChartConfigChange={onChartConfigChange}
        indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
        headerTransparent
      >
        {({ timeConfig, granularity }) => (
          <StatusCodeAlertingBarChart
            websiteId={form.get('websiteId').value}
            threshold={threshold}
            timeThreshold={form.get('timeThreshold').toJS()}
            timeConfig={timeConfig}
            tagFilters={form.get('tagFilters').value}
            numeratorFilter={{
              name: 'beacon.http.status',
              operator: form.get('rule').get('operator').value,
              stringValue: form.get('rule').get('value').value
            }}
            metricName={metricName}
            granularity={granularity}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

StatusCodeInteractiveChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartConfigChange: PropTypes.func.isRequired,
  indexInitialSelectedTimeConfig: PropTypes.number.isRequired,
  debounceOnChange$: PropTypes.object,
  updateForm: PropTypes.func.isRequired
};

function getMaxThresholdValue(metricName) {
  return isRateMetric(metricName) ? 100 : undefined;
}

function isRateMetric(metricName) {
  return metricName === statusCodeRate;
}
