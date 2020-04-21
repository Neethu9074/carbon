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
  thresholdOperatorOptions,
  enrichThresholdOperatorOptionsForApiConfigs
} from 'in-applications/alerting/form/thresholdFormData';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { propTypeTimeConfig } from 'in-stores/time/config';
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
)(ErrorRateInteractiveChart);

function ErrorRateInteractiveChart({ form, timeConfig, onChange, granularity, debounceOnChange$ }) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get('threshold').get('value').value);
  const [doDebounce, setDoDebounce] = useState(false);

  const threshold = {
    ...form.get('threshold').toJS(),
    value:
      (doDebounce
        ? getThresholdValueForPercentageMetric(tempThreshold, true)
        : form.get('threshold').get('value').value) || 0
  };

  return (
    <div className={locals.container}>
      <div className={locals.controls}>
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
              applicationsAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
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
            max="100"
            name="thresholdValue"
            step="1"
            value={
              (doDebounce
                ? tempThreshold
                : getValueRoundedToDecimals(form.get('threshold').get('value').value, true)) ?? 0
            }
            onChange={e => {
              let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

              if (value !== '') {
                value = round(Math.abs(value) / 100, 3);
              }
              setDoDebounce(true);
              setTempThreshold(getValueRoundedToDecimals(value, true));

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

      <ChartContainer headline="Last 24 hours">
        <ErrorRateAlertingBarChart
          applicationId={form.get('applicationId').value}
          timeConfig={timeConfig}
          tagFilters={form.get('tagFilters').value}
          granularity={granularity}
          threshold={threshold}
          timeThreshold={form.get('timeThreshold').toJS()}
          boundaryScope={form.get('boundaryScope').value}
          alertsPreviewEnabled
          canReload
        />
      </ChartContainer>
    </div>
  );
}

ErrorRateInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};
