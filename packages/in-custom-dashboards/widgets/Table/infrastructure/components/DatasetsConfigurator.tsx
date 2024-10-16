/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useEffect } from 'react';
import { isEqual } from 'lodash';

import { Li, Stack, Ul, Button } from '@instana/components';

// @ts-expect-error
import { autoOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import DatasetsColumn from 'in-custom-dashboards/widgets/Table/infrastructure/components/DatasetsColumn';
import { sorting as sortingFieldName } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
// @ts-expect-error
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import { metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { datasets } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import usePrevious from 'in-hooks/usePrevious';
import { MetricSource } from 'in-types';
import { t } from 'in-i18n';

export interface DatasetsConfiguratorProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  updateForm: (form: MapForm<any>) => void;
  entityType: string;
  source: MetricSource;
  maxLength: number;
}

export default function DatasetsConfigurator({
  entityType,
  form,
  maxLength,
  updateForm,
  onChange,
  source
}: DatasetsConfiguratorProps) {
  const metricsForm = form.get(datasets).get(metricsPath);
  const metricsFormSize = metricsForm.size;
  const sortingField = form.get(sortingFieldName)?.value;
  const shouldDisplayDataset = metricsFormSize < maxLength;

  // Store the previous form state in order to show the error message when having duplicated metrics.
  // It's necessary, since the last metric added is removed from the form, so it needs to access the previous state to show the error message.
  const previousMetricsForm = usePrevious(metricsForm);
  const hasErrors = previousMetricsForm?.messages?.length > 0;

  const metricFormField = createMetricForm(null, {
    withLabelConfiguration: true,
    withCompareToTimeShifted: true,
    withEnablePotentialProblems: true,
    withColorConfiguration: true,
    withMetricFormatter: true,
    withEmptyValueFilter: true,
    withThresholdConfiguration: true
  });

  const previousMetrics = getMetrics(previousMetricsForm);
  const currentMetrics = getMetrics(metricsForm);
  const indexOfMetricThatHasChanged = getMetricIndexChanged(previousMetrics, currentMetrics);

  const isDefaultSorting = isEqual(sortingField, defaultOrder);
  const hasDifferentMetrics = indexOfMetricThatHasChanged > -1;
  const currentOrderByIsEqualPreviousMetricLabel = sortingField?.by === previousMetrics[indexOfMetricThatHasChanged];

  const shouldUpdateOrder = !isDefaultSorting && hasDifferentMetrics && currentOrderByIsEqualPreviousMetricLabel;

  // Update dataset field when metrics get changed via regex
  useEffect(() => {
    if (shouldUpdateOrder) {
      onChange([sortingFieldName], (field: any) =>
        field
          .setValue({
            ...field.value,
            by: currentMetrics[indexOfMetricThatHasChanged] ?? defaultOrder?.by
          })
          .setTouched(true)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMetrics, indexOfMetricThatHasChanged, shouldUpdateOrder]);

  useEffect(
    () => {
      if (!metricsFormSize) {
        handleAutoOpen(0, metricFormField);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const hasErrors = metricsForm.messages.length > 0;

    // In case duplicated metrics, remove the last one
    if (hasErrors) {
      onChange([datasets, metricsPath], field => {
        // @ts-expect-error
        return field.remove(metricsFormSize - 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricsForm.messages.length, metricsFormSize, onChange]);

  const handleAutoOpen = (itemIndex: number, callback: () => void) => {
    autoOpen(datasets, itemIndex);
    // @ts-expect-error
    onChange([datasets, metricsPath], field => field.push(callback));
  };

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.infrastructure.datasets')}</Header>

      {hasErrors && <TouchedMessages field={previousMetricsForm} />}

      <Ul>
        <DatasetsColumn
          form={form}
          metricsForm={metricsForm}
          onChange={onChange}
          updateForm={updateForm}
          startNumber={0}
          entityType={entityType}
          source={source}
        />

        {shouldDisplayDataset && (
          <Li noAlternatingBg>
            <Stack direction="horizontal" align="center" distribution="start">
              <Button
                kind="action"
                icon="lib_openclose_add_circle_outline"
                onClick={() => handleAutoOpen(metricsFormSize, metricFormField)}
              >
                {t('in-custom-dashboards:widgets.formCompChart.dataConfigChart.addDataset')}
              </Button>
            </Stack>
          </Li>
        )}
      </Ul>
    </Stack>
  );
}

function getMetricIndexChanged(previousMetrics: string[], currentMetrics: string[]) {
  for (let i = 0; i < previousMetrics.length; i++) {
    if (!isEqual(previousMetrics[i], currentMetrics[i])) {
      return i;
    }
  }
  return -1;
}

function getMetrics(form: any) {
  if (!form || !form.items) {
    return [];
  }

  return form.items
    .map((field: any) => {
      const metric = field.get('metric')?.value;
      const aggregation = field.get('aggregation')?.value;

      if (metric !== '' && aggregation) {
        return `${metric}.${aggregation}`;
      }

      return null;
    })
    .filter(Boolean);
}
