/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

//@ts-expect-error
import { includesInSelectedAggregations } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
import { SelectInSection as SelectionSection } from 'in-alerting/smart-alerts/components/tearSheet/Section/SelectInSection';
import CrossSeriesAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CrossSeriesAggregation';
//@ts-expect-error
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

interface ScopeAggregationProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isTearSheet?: boolean;
}
export default function ScopeAggregation({ form, updateForm, isTearSheet = false }: ScopeAggregationProps) {
  const aggregationField = form.get('rule')?.get('aggregation');
  const metricField = form.get('rule')?.get('metricName');
  const crossSeriesAggregationField = form.get('rule')?.get('crossSeriesAggregation');
  const crossSeriesAggregationValue = crossSeriesAggregationField.value;

  const isCrossSeriesSumAggregationToggleEnabled = includesInSelectedAggregations(aggregationField.value);
  const [isSumCrossSeriesAggregation, setIsSumCrossSeriesAggregation] = useState(
    crossSeriesAggregationValue == 'SUM' &&
      (isCrossSeriesSumAggregationToggleEnabled || aggregationRequiresCrossSeriesSum(aggregationField.value))
      ? true
      : false
  );
  const [aggregation, setAggregation] = useState(aggregationField.value ?? 'MEAN');

  const handleAggregationChange = (aggregationValue: string) => {
    const isCrossSeriesSum = aggregationRequiresCrossSeriesSum(aggregationValue);
    setAggregation(aggregationValue);
    setIsSumCrossSeriesAggregation(isCrossSeriesSum);

    const newCrossSeriesAggregation = isCrossSeriesSum ? 'SUM' : aggregationValue;
    updateForm(
      form
        .updateIn(['rule', 'crossSeriesAggregation'], field =>
          (field as Field<string>).setValue(newCrossSeriesAggregation).setTouched(true)
        )
        .updateIn(['rule', 'aggregation'], f => (f as Field<string>).setValue(aggregationValue).setTouched(true))
    );
  };

  const handleSumCrossSeriesAggregationChange = () => {
    setIsSumCrossSeriesAggregation(prev => {
      const newCrossSeriesAggregation = !prev ? 'SUM' : aggregation;
      updateForm(
        form.updateIn(['rule', 'crossSeriesAggregation'], field =>
          (field as Field<string>).setValue(newCrossSeriesAggregation).setTouched(true)
        )
      );
      return !prev;
    });
  };

  const SelectSection = isTearSheet ? SelectionSection : SelectInSection;

  return (
    <SelectSection
      label={getLabel(isTearSheet)}
      id="metric-configurator-infra-aggregation"
      value={aggregationField?.value}
      onChange={e => handleAggregationChange(e.target.value)}
      useAlternateBg={!isTearSheet}
      disabled={!metricField.valid}
      additionalContent={
        <>
          <CrossSeriesAggregation
            aggregationField={aggregationField}
            isCrossSeriesSumAggregationToggleEnabled={isCrossSeriesSumAggregationToggleEnabled}
            isSumCrossSeriesAggregation={isSumCrossSeriesAggregation}
            handleSumCrossSeriesAggregationChange={handleSumCrossSeriesAggregationChange}
            crossSeriesAggregationField={crossSeriesAggregationField}
            isTearSheet={isTearSheet}
          />
        </>
      }
    >
      <>
        {Object.keys(aggregationLabels).map(aggregation => (
          <option key={aggregation} value={aggregation}>
            {aggregationLabels[aggregation]}
          </option>
        ))}
      </>
    </SelectSection>
  );
}

function aggregationRequiresCrossSeriesSum(aggregationFieldValue: string) {
  return ['SUM', 'PER_SECOND', 'INCREASE'].includes(aggregationFieldValue);
}

function getLabel(isTearSheet: boolean): JSX.Element | string {
  return isTearSheet ? (
    <AlertTypography
      variant="body-regular"
      color="color900"
      content={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.aggregation.aggregation')}
    />
  ) : (
    t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.aggregation.aggregation')
  );
}
