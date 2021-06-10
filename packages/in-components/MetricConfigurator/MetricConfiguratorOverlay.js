/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm } from 'formalistic';
import React, { useEffect, useState, useMemo } from 'react';

import MetricConfiguratorOverlayPresenter from 'in-components/MetricConfigurator/MetricConfiguratorOverlayPresenter';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { t } from 'in-i18n';

export default function MetricConfiguratorOverlay({
  onChange: onChangeExternal,
  values,
  options,
  maximumNumberOfMetrics = 5,
  tracking,
  MetricConfiguratorHint
}) {
  const initialForm = useMemo(() => getInitialForm(values, options, maximumNumberOfMetrics), [
    values,
    options,
    maximumNumberOfMetrics
  ]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialForm !== form) {
      onChangeExternal(form.toJS());
    }
  }, [form]);

  return (
    <MetricConfiguratorOverlayPresenter
      form={form}
      onChange={onChange}
      options={options}
      maximumNumberOfMetrics={maximumNumberOfMetrics}
      getPossibleAggregationsForMetric={metric => getPossibleAggregationsForMetric(metric)}
      onSwap={onSwap}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
      onChangeAggregation={tracking?.onMetricAggregationChanged}
      MetricConfiguratorHint={MetricConfiguratorHint}
    />
  );

  function onRemoveItem(metric, index) {
    tracking?.onMetricRemoved?.({ ...metric.toJS() });
    onChange([], form => form.remove(index).setTouched(false));
  }

  function onAddItem({ metric, aggregation }) {
    onChange([], form =>
      form.push(getMetricItem(options, metric, getPossibleAggregationsForMetric(metric)[0])).setTouched(false)
    );
    tracking?.onMetricAdded?.({ metric, aggregation });
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

  function getPossibleAggregationsForMetric(metric) {
    const aggregations = options.find(opt => opt.metric === metric).aggregations;
    const alreadySelectedAggregations = form.items
      .filter(m => m.items.metric.value === metric)
      .map(m => m.items.aggregation.value);

    return aggregations.filter(a => !alreadySelectedAggregations.includes(a));
  }
}

function getInitialForm(values, options, maximumNumberOfMetrics) {
  return createListForm({
    validator: metrics => {
      if (metrics.length > maximumNumberOfMetrics) {
        return [
          {
            severity: 'error',
            message: t('in-components:metricConfigurator.messagePleaseSelectAtMostMetrics', {
              maximumNumberOfMetrics: maximumNumberOfMetrics
            })
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
