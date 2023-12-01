/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field, Item } from 'formalistic';
import React from 'react';

//@ts-expect-error
import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import MetricSelectionCategoryOverlay from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/MetricSelectionCategoryOverlay';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

interface ScopeMetricProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}
interface Node {
  metric: string;
  label: string;
  parentLabels: string[];
}

export default function ScopeMetric({ form, updateForm, onChange }: ScopeMetricProps) {
  const metricField = form.get('rule').get('metricName');
  const metricLabelField = form.get('hiddenFields').get('metricLabel');
  const metricPathField = form.get('hiddenFields').get('metricPath');
  const metric = metricField.value || undefined;
  const backendQueryModel = EMPTY_EXPRESSION;

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    query: catalogQuery.debouncedValue
  });
  const metricMetadata = {
    metric,
    label: metricLabelField?.value,
    path: metricPathField?.value,
    loading:
      ((metricLabelField && !metricLabelField?.value) ||
        !metricPathField?.value ||
        metricPathField?.value.length == 0) &&
      metricCatalog.progress.loading
  };
  const stableMetricCatalog = catalogQuery.value === catalogQuery.debouncedValue ? metricCatalog : pendingResult;
  const onMetricChange = (
    metricObj: Node,
    form: MapForm<any>,
    updateForm: ((form: MapForm<any>) => void) | undefined
  ) => {
    //@ts-expect-error
    updateForm(
      form
        .updateIn(['hiddenFields', 'metricLabel'], field =>
          (field as Field<string>).setValue(metricObj.label).setTouched(true)
        )
        .updateIn(['hiddenFields', 'metricPath'], field =>
          //@ts-expect-error
          (field as Field<string>).setValue(metricObj.parentLabels).setTouched(true)
        )
        .updateIn(['rule', 'metricName'], f => (f as Field<string>).setValue(metricObj.metric).setTouched(true))
    );
  };
  return (
    <>
      <TypeAndMetricConfigurator
        metricMetadata={metricMetadata}
        metricCatalog={stableMetricCatalog.data}
        loading={stableMetricCatalog.progress.loading}
        errors={stableMetricCatalog.errors}
        onMetricChange={(metricObj: Node) => onMetricChange(metricObj, form, updateForm)}
        query={catalogQuery.value}
        onQueryChange={catalogQuery.onChange}
        selectMetric={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.metric.selectMetric')}
        onChange={onChange}
        backendQueryModel={backendQueryModel}
        SelectorOverlay={MetricSelectionCategoryOverlay}
      />
      <TouchedMessages field={metricField} />
    </>
  );
}
