/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field, Item } from 'formalistic';
import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';

//@ts-expect-error
import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
//@ts-expect-error
import { toOptions } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import MetricSelectionCategoryOverlay from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/MetricSelectionCategoryOverlay';
//@ts-expect-error
import { getMetricPathAndLabel } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { emptyArray } from 'in-services/fixedObjects';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

interface ScopeMetricProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  isRegex: boolean;
}
interface Node {
  metric: string;
  parentType: string;
  label: string;
  parentLabels: string[];
}

export default function ScopeMetric({ form, updateForm, onChange, isRegex }: ScopeMetricProps) {
  const metricField = form.get('rule').get('metricName');
  const entityTypeField = form.get('rule').get('entityType');
  const metricLabelField = form.get('hiddenFields').get('metricLabel');
  const metricPathField = form.get('hiddenFields').get('metricPath');
  const metric = !isRegex ? metricField.value || undefined : undefined;
  const entityType = entityTypeField?.value;
  let metricLabel = metricLabelField?.value;
  let metricPath = metricPathField?.value;
  const backendQueryModel = EMPTY_EXPRESSION;
  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type: undefined,
    query: catalogQuery.debouncedValue
  });

  const options = useMemo(
    () => (metric && !metricPath && metricCatalog?.data?.tree ? toOptions(metricCatalog?.data?.tree, []) : emptyArray),
    [metricCatalog, metric, metricPath]
  );

  const metricPathAndLabel = useMemo(
    () => (!metricPath && options.length ? getMetricPathAndLabel(options, metric, entityType) : {}),
    [options, metric, entityType, metricPath]
  );

  if (!metricLabel && !metricPath?.length && !isEmpty(metricPathAndLabel)) {
    metricLabel = metricPathAndLabel.label;
    metricPath = metricPathAndLabel.path;
    if (updateForm) {
      updateFormField({
        updateForm,
        form,
        metricLabel: metricLabel,
        metricPath: metricPath,
        clearGroupFilter: false
      });
    }
  }

  const metricMetadata = {
    metric,
    label: metricLabel,
    path: metricPath,
    loading:
      ((metricLabelField && !metricLabel) || !metricPath || metricPath.length == 0) && metricCatalog.progress.loading
  };
  const stableMetricCatalog = catalogQuery.value === catalogQuery.debouncedValue ? metricCatalog : pendingResult;
  const onMetricChange = (
    metricObj: Node,
    form: MapForm<any>,
    updateForm: ((form: MapForm<any>) => void) | undefined
  ) => {
    if (metric !== metricObj.metric && updateForm) {
      updateFormField({
        updateForm,
        form,
        metricLabel: metricObj.label,
        metricPath: metricObj.parentLabels,
        entityType: metricObj.parentType,
        metric: metricObj.metric,
        clearGroupFilter: true
      });
    }
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
        type={entityTypeField}
      />
      <TouchedMessages field={metricField} />
    </>
  );
}

interface UpdateFormFieldProp {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  metricLabel: string;
  metricPath: string[];
  entityType?: string;
  metric?: string;
  clearGroupFilter: boolean;
}

function updateFormField({
  updateForm,
  form,
  metricLabel,
  metricPath,
  entityType,
  metric,
  clearGroupFilter
}: UpdateFormFieldProp) {
  let updatedForm = form;
  if (metricLabel) {
    updatedForm = updatedForm.updateIn(['hiddenFields', 'metricLabel'], field =>
      (field as Field<string>).setValue(metricLabel).setTouched(true)
    );
  }
  if (metricPath) {
    updatedForm = updatedForm.updateIn(['hiddenFields', 'metricPath'], field =>
      (field as Field<string[]>).setValue(metricPath).setTouched(true)
    );
  }
  if (entityType) {
    updatedForm = updatedForm.updateIn(['rule', 'entityType'], field =>
      (field as Field<string>).setValue(entityType).setTouched(true)
    );
  }
  if (metric) {
    updatedForm = updatedForm.updateIn(['rule', 'metricName'], field =>
      (field as Field<string>).setValue(metric).setTouched(true)
    );
  }
  if (clearGroupFilter) {
    updatedForm = updatedForm
      .updateIn(['groupBy'], field => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn(['tagFilterExpression'], field => (field as Field<string[]>).setValue([]).setTouched(true));
  }

  updateForm(updatedForm);
}
