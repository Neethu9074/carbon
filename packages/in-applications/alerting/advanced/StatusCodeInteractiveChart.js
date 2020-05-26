import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  enrichThresholdOperatorOptionsForApiConfigs,
  thresholdOperatorOptions
} from 'in-applications/alerting/form/thresholdFormData';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-applications/alerting/trackingHelpers';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import { getThresholdValueForPercentageMetric } from 'in-new-components/Alerting/utils/formatUtils';
import StatusCodeAlertingBarChart from 'in-applications/alerting/chart/StatusCodeAlertingBarChart';
import { applicationsAlertingThresholdOperatorChanged } from 'in-applications/alerting/tracker';
import { ruleMetricNameOptions } from 'in-applications/alerting/form/ruleFormData';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { joinClassNames } from 'in-services/util/classnames';
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
)(StatusCodeInteractiveChart);

function StatusCodeInteractiveChart({ form, timeConfig, onChange, granularity, debounceOnChange$ }) {
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
      {hasStatusCodeSelected(form) ? (
        <>
          <div className={locals.controls}>
            <FormGroup>
              <Label htmlFor="statusCode">Metric</Label>
              <Input
                id="statusCode"
                className={joinClassNames(locals.narrowControl, locals.disabledControl)}
                name="statusCode"
                value={ruleMetricNameOptions.statusCode[0].label}
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
                onChange={e => {
                  const value = e?.value ?? '';
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
            </FormGroup>
          </div>

          <ChartContainer headline="Last 24 hours">
            <StatusCodeAlertingBarChart
              applicationId={form.get('applicationId').value}
              threshold={threshold}
              statusCodeStart={form.get('rule').get('statusCodeStart').value}
              statusCodeEnd={form.get('rule').get('statusCodeEnd').value}
              timeThreshold={form.get('timeThreshold').toJS()}
              timeConfig={timeConfig}
              tagFilters={form.get('tagFilters').value}
              granularity={granularity}
              boundaryScope={form.get('boundaryScope').value}
              alertsPreviewEnabled
              canReload
            />
          </ChartContainer>
        </>
      ) : (
        <IncompleteChartPlaceholder message="Please select a Status Code to see when this alert triggers" />
      )}
    </div>
  );
}

StatusCodeInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};

function hasStatusCodeSelected(form) {
  return !!(form && form.get('rule').get('statusCodeStart').value && form.get('rule').get('statusCodeEnd').value);
}
