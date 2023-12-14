/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import { Toggle } from '@instana/components';
import { Spacer } from '@instana/components';

//@ts-expect-error
import { getCrossSeriesAggregationTooltip } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
//@ts-expect-error
import { includesInSelectedAggregations } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
//@ts-expect-error
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-components/workspace/HelpAction';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation.mless';

interface ScopeAggregationProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}
export default function ScopeAggregation({ form, updateForm }: ScopeAggregationProps) {
  const aggregationField = form.get('rule')?.get('aggregation');
  const metricField = form.get('rule')?.get('metricName');
  const crossSeriesAggregationField = form.get('rule')?.get('crossSeriesAggregation');
  const crossSeriesAggregationValue = crossSeriesAggregationField.value;
  const isCrossSeriesSumAggregationToggleEnabled = includesInSelectedAggregations(aggregationField.value);

  const [isSumCrossSeriesAggregation, setIsSumCrossSeriesAggregation] = useState(
    crossSeriesAggregationValue == 'SUM' && isCrossSeriesSumAggregationToggleEnabled ? true : false
  );
  const handleAggregationChange = (
    aggregation: string,
    form: MapForm<any>,
    updateForm?: (form: MapForm<any>) => void
  ) => {
    if (!isCrossSeriesSumAggregationToggleEnabled) {
      setIsSumCrossSeriesAggregation(false);
      setcrossSeriesAggregation(form, updateForm);
    }
    if (updateForm)
      updateForm(
        form.updateIn(['rule', 'aggregation'], f => (f as Field<string>).setValue(aggregation).setTouched(true))
      );
  };

  const handleSumCrossSeriesAggregationChange = (form: MapForm<any>, updateForm?: (form: MapForm<any>) => void) => {
    setIsSumCrossSeriesAggregation(!isSumCrossSeriesAggregation);
    setcrossSeriesAggregation(form, updateForm);
  };

  function setcrossSeriesAggregation(form: MapForm<any>, updateForm?: (form: MapForm<any>) => void) {
    const newCrossSeriesAggregation = isSumCrossSeriesAggregation ? 'SUM' : form.get('rule')?.get('aggregation').value;
    if (updateForm)
      updateForm(
        form.updateIn(['rule', 'crossSeriesAggregation'], field =>
          (field as Field<string>).setValue(newCrossSeriesAggregation).setTouched(true)
        )
      );
  }

  return (
    <SelectInSection
      label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.aggregation.aggregation')}
      id="metric-configurator-infra-aggregation"
      value={aggregationField?.value}
      onChange={e => handleAggregationChange(e.target.value, form, updateForm)}
      useAlternateBg
      disabled={!metricField.valid}
      additionalContent={
        <>
          <TouchedMessages field={aggregationField} />
          <div className={locals.crossSeriesAggregationWrapper}>
            <Tooltip
              content={getCrossSeriesAggregationTooltip(
                false,
                isCrossSeriesSumAggregationToggleEnabled,
                aggregationField.value
              )}
            >
              <span>
                <Toggle
                  id="metric-configurator-cross-series-aggregation"
                  checked={isSumCrossSeriesAggregation}
                  disabled={!isCrossSeriesSumAggregationToggleEnabled}
                  onChange={() => handleSumCrossSeriesAggregationChange(form, updateForm)}
                />
              </span>
            </Tooltip>
            <Spacer horizontal="xxsmall" />
            {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation')}
            <Spacer horizontal="small" />
            <HelpAction>
              {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationHelp')}
            </HelpAction>
          </div>
          <TouchedMessages field={crossSeriesAggregationField} />
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
    </SelectInSection>
  );
}
