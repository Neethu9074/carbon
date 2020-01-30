import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { fieldNames, hiddenFieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getFormValueOrDefault, getThresholdLabel } from 'in-websites/eum-alerting/formHelpers';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './EumChart.mless';

export default function SlownessChart({ form, timeConfig, onChange, granularity, isReadOnly }) {
  return (
    <div className={locals.container}>
      {onChange &&
        !isReadOnly &&
        form && (
          <div className={locals.controls}>
            <FormGroup>
              <Label htmlFor={fieldNames.ruleAggregation}>Aggregation</Label>
              <ComboBox
                id={fieldNames.ruleAggregation}
                className={locals.wideControl}
                name={fieldNames.ruleAggregation}
                value={form.get(fieldNames.ruleAggregation).value}
                options={selectOptions[fieldNames.ruleAggregation]}
                onChange={e => {
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  onChange(form, fieldNames.ruleAggregation, (e && e.value) || '', doCalculateThresholdOnBackend);
                }}
                defaultValue="P90"
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
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  onChange(form, fieldNames.thresholdOperator, (e && e.value) || '', doCalculateThresholdOnBackend);
                }}
                defaultValue=">="
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor={fieldNames.thresholdType}>Threshold Type</Label>
              <ComboBox
                id={fieldNames.thresholdType}
                className={locals.wideControl}
                name={fieldNames.thresholdType}
                value={form.get(fieldNames.thresholdType).value}
                options={selectOptions[fieldNames.thresholdType]}
                onChange={e => {
                  const thresholdType = e.value || '';
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  const seasonality = {
                    name: fieldNames.thresholdSeasonality,
                    value: thresholdType === 'historicBaseline.DAILY' ? 'DAILY' : 'WEEKLY'
                  };

                  let updatedForm = form;
                  if (thresholdType === 'staticThreshold') {
                    updatedForm = withSlownessFormStaticThreshold(form);
                  }

                  if (thresholdType.startsWith('historicBaseline.')) {
                    updatedForm = withSlownessFormHistoricBaseline(form);
                  }

                  onChange(
                    updatedForm,
                    fieldNames.thresholdType,
                    thresholdType,
                    doCalculateThresholdOnBackend,
                    seasonality
                  );
                }}
                defaultValue="staticThreshold"
                clearable={false}
              />
            </FormGroup>
            {form.get(fieldNames.thresholdType).value === 'staticThreshold' ? (
              <FormGroup>
                <Label htmlFor={fieldNames.thresholdValue}>{getThresholdLabel(form)}</Label>
                <Input
                  id={fieldNames.thresholdValue}
                  className={locals.narrowControl}
                  type="number"
                  min="0"
                  name={fieldNames.thresholdValue}
                  value={getFormValueOrDefault(form, fieldNames.thresholdValue, '')}
                  step="1"
                  onChange={e =>
                    onChange(form, fieldNames.thresholdValue, e.target.value !== '' ? Math.abs(e.target.value) : '')
                  }
                />
              </FormGroup>
            ) : (
              <FormGroup>
                <Label htmlFor={fieldNames.thresholdDeviationFactor}>Sensitivity</Label>
                <Input
                  id={fieldNames.thresholdDeviationFactor}
                  className={locals.narrowControl}
                  type="number"
                  min="0"
                  name={fieldNames.thresholdDeviationFactor}
                  value={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 1)}
                  step="0.1"
                  onChange={e =>
                    onChange(
                      form,
                      fieldNames.thresholdDeviationFactor,
                      e.target.value !== '' ? Math.abs(e.target.value) : ''
                    )
                  }
                />
              </FormGroup>
            )}
          </div>
        )}
      <div className={locals.placeholder}>
        <SlownessAlertingBarChart
          websiteId={form.get(fieldNames.websiteId).value}
          thresholdType={form.get(fieldNames.thresholdType).value}
          threshold={getFormValueOrDefault(form, fieldNames.thresholdValue)}
          operator={form.get(fieldNames.thresholdOperator).value}
          sensitivity={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor)}
          baseline={getFormValueOrDefault(form, fieldNames.thresholdBaseline, [])}
          timeConfig={timeConfig}
          tagFilters={form.get(fieldNames.tagFilters).value}
          aggregation={form.get(fieldNames.ruleAggregation).value}
          granularity={granularity}
        />
      </div>
    </div>
  );
}

SlownessChart.propTypes = {
  form: PropTypes.object,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool
};
