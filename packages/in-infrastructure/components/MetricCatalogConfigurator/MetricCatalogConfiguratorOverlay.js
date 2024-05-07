/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, createListForm } from 'formalistic';
import React, { useEffect, useState, useMemo } from 'react';

import MetricCatalogConfiguratorOverlayPresenter from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfiguratorOverlayPresenter';
import { booleanValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { t } from 'in-i18n';

export default function MetricCatalogConfiguratorOverlay({
  onChange: onChangeExternal,
  values,
  maximumNumberOfMetrics = 5,
  tracking,
  MetricCatalogConfiguratorHint,
  query,
  onQueryChange,
  metricCatalog,
  type,
  metricMetadatas
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialForm = useMemo(() => getInitialForm(values, maximumNumberOfMetrics), [values, maximumNumberOfMetrics]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialForm !== form) {
      onChangeExternal(form.toJS());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (form.size === 0 && values.length !== 0) {
      setForm(getInitialForm(values, maximumNumberOfMetrics));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <MetricCatalogConfiguratorOverlayPresenter
      form={form}
      onChange={onChange}
      maximumNumberOfMetrics={maximumNumberOfMetrics}
      getPossibleAggregationsForMetric={getPossibleAggregations}
      onSwap={onSwap}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
      shouldTriggerWindowResize
      onChangeAggregation={tracking?.onMetricAggregationChanged}
      MetricCatalogConfiguratorHint={MetricCatalogConfiguratorHint}
      metricCatalog={metricCatalog.data}
      loading={metricCatalog.progress && metricCatalog.progress.loading}
      query={query}
      onQueryChange={onQueryChange}
      type={type}
      metricMetadatas={metricMetadatas}
    />
  );

  function onRemoveItem(metric, index) {
    tracking?.onMetricRemoved?.({ ...metric.toJS() });
    onChange([], form => form.remove(index).setTouched(false));
  }

  function onAddItem(metric) {
    onChange([], form => form.push(getMetricItem(metric)).setTouched(false));
    tracking?.onMetricAdded?.(metric);
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

  function getPossibleAggregations() {
    return Object.keys(aggregationLabels);
  }

  function getInitialForm(values, maximumNumberOfMetrics) {
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

      items: values.map(({ metric, aggregation, crossSeriesAggregation, label, required }) =>
        getMetricItem({ metric, aggregation, crossSeriesAggregation, label, required })
      )
    });
  }

  function getMetricItem(props) {
    const { metric, aggregation, crossSeriesAggregation, label, required } = props;
    return createMapForm({
      validator: ({ metric, aggregation }) => {
        if (!metric.valid || !aggregation.valid) {
          return null;
        }

        const allowedAggregations = getPossibleAggregations();
        return buildEnumValidator(allowedAggregations)(aggregation.value);
      },
      items: {
        metric: createField({
          value: metric || '',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        }),
        aggregation: createField({
          value: aggregation || '',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        }),
        crossSeriesAggregation: createField({
          value: crossSeriesAggregation,
          validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
        }),
        required: createField({
          value: required,
          validator: composeAndShortCircuitOnError(booleanValidator)
        }),
        label: createField({
          value: label,
          validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
        })
      }
    });
  }
}
