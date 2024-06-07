/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import { MapForm, Field } from 'formalistic';

import { Spacer } from '@instana/components';
import { Toggle } from '@instana/legacy';

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
  updateForm: (form: MapForm<any>) => void;
}
export default function ScopeAggregation({ form, updateForm }: ScopeAggregationProps) {
  const aggregationField = form.get('rule')?.get('aggregation');
  const metricField = form.get('rule')?.get('metricName');
  const crossSeriesAggregationField = form.get('rule')?.get('crossSeriesAggregation');
  const crossSeriesAggregationValue = crossSeriesAggregationField.value;
  const isCrossSeriesSumAggregationToggleEnabled = includesInSelectedAggregations(aggregationField.value);
  const [isSumCrossSeriesAggregation, setIsSumCrossSeriesAggregation] = useState(
    crossSeriesAggregationValue == 'SUM' &&
      (isCrossSeriesSumAggregationToggleEnabled || ifAggregationSumOrRate(aggregationField.value))
      ? true
      : false
  );
  const [aggregation, setAggregation] = useState(aggregationField.value ?? 'MEAN');

  const handleAggregationChange = (aggregationValue: string) => {
    setAggregation(aggregationValue);
    if (ifAggregationSumOrRate(aggregationValue)) {
      setIsSumCrossSeriesAggregation(true);
    } else if (!includesInSelectedAggregations(aggregationValue)) {
      setIsSumCrossSeriesAggregation(false);
    }
  };

  const handleSumCrossSeriesAggregationChange = () => {
    setIsSumCrossSeriesAggregation(!isSumCrossSeriesAggregation);
  };

  useEffect(() => {
    const newCrossSeriesAggregation = isSumCrossSeriesAggregation ? 'SUM' : aggregation;
    updateForm(
      form
        .updateIn(['rule', 'crossSeriesAggregation'], field =>
          (field as Field<string>).setValue(newCrossSeriesAggregation).setTouched(true)
        )
        .updateIn(['rule', 'aggregation'], f => (f as Field<string>).setValue(aggregation).setTouched(true))
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSumCrossSeriesAggregation, aggregation]);

  return (
    <SelectInSection
      label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.aggregation.aggregation')}
      id="metric-configurator-infra-aggregation"
      value={aggregationField?.value}
      onChange={e => handleAggregationChange(e.target.value)}
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
                  onChange={handleSumCrossSeriesAggregationChange}
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

function ifAggregationSumOrRate(aggregationFieldValue: string) {
  return ['SUM', 'PER_SECOND'].includes(aggregationFieldValue);
}
