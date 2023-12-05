/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

//@ts-expect-error
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { t } from 'in-i18n';

interface ScopeAggregationProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}
export default function ScopeAggregation({ form, updateForm }: ScopeAggregationProps) {
  const aggregationField = form.get('aggregation');
  const handleAggregationChange = (
    aggregation: string,
    form: MapForm<any>,
    updateForm?: (form: MapForm<any>) => void
  ) => {
    if (updateForm)
      updateForm(
        form.updateIn(['rule', 'aggregation'], f => (f as Field<string>).setValue(aggregation).setTouched(true))
      );
  };
  return (
    <SelectInSection
      label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.aggregation.aggregation')}
      id="metric-configurator-infra-aggregation"
      value={aggregationField?.value}
      onChange={e => handleAggregationChange(e.target.value, form, updateForm)}
      useAlternateBg
    >
      <>
        {Object.keys(aggregationLabels).map(aggregation => (
          <option key={aggregation} value={aggregation}>
            {aggregationLabels[aggregation]}
          </option>
        ))}
      </>
    </SelectInSection>
  );
}
