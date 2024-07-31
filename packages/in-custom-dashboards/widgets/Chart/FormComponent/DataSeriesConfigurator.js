/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Ul, Li, Message, Stack, Button } from '@instana/components';

import { hasPotentialProblems } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { autoFormatterTimeSeriesEnabled, unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import { getCommonFormatterForUnits } from 'in-custom-dashboards/widgets/_shared/formatters';
import { unitPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { autoOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import { potentialProblemsEnabled } from 'in-services/featureFlags';
import { defaultFormatter } from 'in-stores/metric/formatters';
import { getBaseUnit } from 'in-stores/metric/units';
import { t } from 'in-i18n';

export default function DataSeriesConfigurator({
  form,
  onChange,
  getShortMetricKey,
  withLastValue = false,
  withUnit = false
}) {
  const hasY2 = form.get('y2').get('metrics').size > 0;
  const axisForm = form.get('y1');
  const formatterSelected = axisForm?.get('formatterSelected')?.value;

  useEffect(
    () => {
      const axisForm = form.get('y1');
      const metricsFormSize = axisForm.get('metrics').size;
      if (!metricsFormSize) {
        autoOpen('y1', 0);
        onChange([], form => {
          const f = form
            .updateIn(['y1', 'metrics'], field => field.push(createMetricForm()))
            .updateIn(['y1', 'formatterSelected'], field => field.setValue(false).setTouched(true));
          return f;
        });
      }
    },
    // Run this only once when the component renders for the first time
    // If there is no dataset selected, add one and open it by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* Only on component did mount */
    ]
  );

  const metrics1 = form.get('y1').get('metrics');
  const metrics2 = form.get('y2').get('metrics');
  const atLeastOnePPEnabled = [...metrics1.toJS(), ...metrics2.toJS()].find(hasPotentialProblems);
  const disabled = potentialProblemsEnabled && atLeastOnePPEnabled;

  useEffect(() => {
    const uniqueMetricsFormatters = [
      ...new Set(metrics1?.map(metric => metric?.get('formatter')?.value).filter(Boolean))
    ];
    const hasUniqueMetrics = uniqueMetricsFormatters.length > 0;
    const units = unitForInfraMetricsEnabled
      ? metrics1?.map(metric => getBaseUnit(metric?.get(unitPath)?.value)).filter(Boolean)
      : [];

    const formatterValue =
      units.length > 0
        ? getCommonFormatterForUnits(...units)[0]?.id
        : uniqueMetricsFormatters.length == 1
        ? uniqueMetricsFormatters[0]
        : defaultFormatter.id;

    const shouldNotUpdateFormatter =
      !autoFormatterTimeSeriesEnabled || !hasUniqueMetrics || formatterSelected === undefined || formatterSelected;

    if (shouldNotUpdateFormatter) {
      return;
    }

    onChange([], form => {
      const f = form
        .updateIn(['y1', 'formatter'], field => field.setValue(formatterValue).setTouched(true))
        .updateIn(['y1', 'formatterSelected'], field => field.setValue(false).setTouched(true));
      return f;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics1]);

  return (
    <Ul>
      <DataSeriesForAxis
        form={form}
        onChange={onChange}
        axisName="y1"
        startNumber={0}
        getShortMetricKey={getShortMetricKey}
        withLastValue={withLastValue}
        withUnit={withUnit}
      />
      <DataSeriesForAxis
        form={form}
        onChange={onChange}
        axisName="y2"
        startNumber={form.get('y1').get('metrics').size}
        getShortMetricKey={getShortMetricKey}
        withLastValue={withLastValue}
        withUnit={withUnit}
      />
      <Li noAlternatingBg>
        <Stack direction="horizontal" align="center" distribution="start">
          <Button
            kind="action"
            disabled={disabled}
            icon="lib_openclose_add_circle_outline"
            onClick={() => {
              const axisName = hasY2 ? 'y2' : 'y1';
              const indexInAxis = form.get(axisName).get('metrics').size;
              autoOpen(axisName, indexInAxis);
              onChange([axisName, 'metrics'], f => f.push(createMetricForm()));
            }}
          >
            {t('in-custom-dashboards:widgets.formCompChart.dataConfigChart.addDataset')}
          </Button>
          {disabled && (
            <Message
              title={t('in-custom-dashboards:widgets.formCompChart.dataConfigChart.tooltipDisabledBecausePP')}
              small
              withIcon
            />
          )}
        </Stack>
      </Li>
    </Ul>
  );
}

function DataSeriesForAxis({ form, axisName, onChange, startNumber, getShortMetricKey, withLastValue, withUnit }) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');
  const type = form.get('type')?.value;
  let eventIndex = 0;
  return (
    <>
      {metricsForm.map((metricForm, i) => {
        if (metricForm.get('source').value === 'EVENT') {
          eventIndex++;
        }

        return (
          <MetricConfiguration
            key={i}
            index={startNumber + i}
            indexInAxis={i}
            metricForm={metricForm}
            onChange={onChange}
            axisName={axisName}
            form={form}
            type={type}
            getShortMetricKey={getShortMetricKey}
            displayDFQ={eventIndex > 1 ? false : true}
            withLastValue={withLastValue}
            withUnit={withUnit}
          />
        );
      })}
    </>
  );
}
