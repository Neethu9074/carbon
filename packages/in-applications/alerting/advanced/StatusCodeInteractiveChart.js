import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-applications/alerting/form/thresholdFormData';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import { getThresholdValueForPercentageMetric } from 'in-new-components/Alerting/utils/formatUtils';
import { debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { joinClassNames } from 'in-services/util/classnames';
import ComboBox from 'in-components/ComboBox/ComboBox';
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
          <AlertingBarChart
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
  setTempThreshold,
  setDoDebounce,
  debounceOnChange$
}) {
  const metricName = form.get('rule').get('metricName');

  return (
    // TODO needs refactoring to new design, similar to other blueprints..
    <div className={locals.controls}>
      <FormGroup>
        <Label htmlFor="statusCode">Metric</Label>
        <Input
          id="statusCode"
          className={joinClassNames(locals.narrowControl, locals.disabledControl)}
          name="statusCode"
          value={blueprintConfig.getMetricLabel(metricName)}
          disabled
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
          onChange={({ value = '' }) => {
            onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
            applicationsAlertingThresholdOperatorChanged(getTrackingObject(form, { value }));
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
          name="thresholdValue"
          step="1"
          value={doDebounce ? tempThreshold : form.get('threshold').get('value').value ?? 0}
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
      </FormGroup>
    </div>
  );
}

StatusCodeInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
