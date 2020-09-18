import { createField, notBlankValidator, createMapForm, createListForm } from 'formalistic';
import React, { useState, useMemo } from 'react';

import MetricConfiguratorOverlayPresenter from 'in-new-components/MetricConfigurator/MetricConfiguratorOverlayPresenter';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';

export default function MetricConfiguratorOverlay({
  onChange: onChangeExternal,
  close,
  values,
  options,
  maximumNumberOfMetrics = 10
}) {
  const initialForm = useMemo(() => getInitialForm(values, options, maximumNumberOfMetrics), [
    values,
    options,
    maximumNumberOfMetrics
  ]);
  const [form, setForm] = useState(initialForm);

  return (
    <MetricConfiguratorOverlayPresenter
      form={form}
      onChange={onChange}
      options={options}
      onSubmit={onSubmit}
      onSwap={onSwap}
      onAddItem={onAddItem}
      onMetricSelect={onMetricSelect}
      onRemoveItem={onRemoveItem}
    />
  );

  function onRemoveItem(index) {
    onChange([], form => form.remove(index).setTouched(false));
  }

  function onAddItem() {
    onChange([], form => form.push(getMetricItem(options)).setTouched(false));
  }

  function onMetricSelect(index, metric) {
    const aggregations = options.find(opt => opt.metric === metric)?.aggregations;
    if (aggregations && aggregations.length === 1) {
      // set the aggregation field immediately if there is only one possible aggregation
      setForm(
        form
          .updateIn([index, 'metric'], field => field.setValue(metric).setTouched(true))
          .updateIn([index, 'aggregation'], field => field.setValue(aggregations[0]).setTouched(true))
      );
    } else {
      setForm(form.updateIn([index, 'metric'], field => field.setValue(metric)));
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }

    close();
    onChangeExternal(form.toJS());
  }

  function onSwap(sourceIndex, destinationIndex) {
    onChange([], form => {
      const metric = form.get(sourceIndex);
      return form.remove(sourceIndex).insert(destinationIndex, metric);
    });
  }

  function onChange(path, fn) {
    setForm(form.updateIn(path, fn));
  }
}

function getInitialForm(values, options, maximumNumberOfMetrics) {
  return createListForm({
    validator: metrics => {
      if (metrics.length > maximumNumberOfMetrics) {
        return [
          {
            severity: 'error',
            message: `Please select at most ${maximumNumberOfMetrics} metrics.`
          }
        ];
      }
      return null;
    },

    items: values.map(({ metric, aggregation }) => getMetricItem(options, metric, aggregation))
  });
}

function getMetricItem(options, metric, aggregation) {
  const supportedMetrics = options.map(({ metric }) => metric);

  return createMapForm({
    validator: ({ metric, aggregation }) => {
      if (!metric.valid || !aggregation.valid) {
        return null;
      }

      const allowedAggregations = options.find(opt => opt.metric === metric.value).aggregations;
      return buildEnumValidator(allowedAggregations)(aggregation.value);
    },
    items: {
      metric: createField({
        value: metric || '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(supportedMetrics)
        )
      }),
      aggregation: createField({
        value: aggregation || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    }
  });
}
