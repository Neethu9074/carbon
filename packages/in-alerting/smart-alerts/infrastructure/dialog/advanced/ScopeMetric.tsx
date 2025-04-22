/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useRef, useState } from 'react';
import { MapForm, Field, Item } from 'formalistic';
import { escapeRegExp } from 'lodash';

//@ts-expect-error
import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import MetricSelectionCategoryOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectionCategoryOverlay';
import {
  getLabelForRegex,
  getPathForRegex
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/formStateManagement';
import { regexValidationError } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/regexValidator';
import { toOptions } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
//@ts-expect-error
import { getMetricPathAndLabel } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import ValidationMessages from 'in-custom-dashboards/widgets/Chart/FormComponent/ValidationMessages';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { emptyArray } from 'in-services/fixedObjects';
import { getPluginName } from 'in-sdk/pluginName';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

interface ScopeMetricProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  isRegex: boolean;
  isTearsheet?: boolean;
}
interface Node {
  metric: string;
  levelType: string;
  label: string;
  parentLabels: string[];
}

export default function ScopeMetric({ form, updateForm, onChange, isRegex, isTearsheet = false }: ScopeMetricProps) {
  const metricField = form.get('rule').get('metricName');
  const entityTypeField = form.get('rule').get('entityType');
  const metricLabelField = form.get('hiddenFields').get('metricLabel');
  const metricPathField = form.get('hiddenFields').get('metricPath');
  const aggregation = form.get('rule')?.get('aggregation').value;

  const metric = metricField?.value;
  const entityType = entityTypeField?.value;
  let metricLabel = metricLabelField?.value;
  let metricPath = metricPathField?.value;
  const getMetricLabel = useGetMetricLabel(entityType, metric, aggregation);
  const entityLabel = getPluginName(entityType, 1);
  const backendQueryModel = EMPTY_EXPRESSION;
  const catalogQuery = useDebouncedValue('', noop, 800);
  const initialRegex = useRef('');
  const [selectedType, onSelectType] = useState();
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type: selectedType,
    query: metric && !metricPath ? metric : catalogQuery.debouncedValue,
    context: 'SMART_ALERTS',
    withHierarchy: true
  });

  // Setting metric label & path for regex option
  if (isRegex && (metricLabel == null || metricPath == null)) {
    metricLabel = getLabelForRegex(metric);
    metricPath = getPathForRegex(metric);
  }

  //Generating options tree from metric catelog
  const options = useMemo(
    () => (metric && !metricPath && metricCatalog?.data?.tree ? toOptions(metricCatalog?.data?.tree, []) : emptyArray),
    [metricCatalog, metric, metricPath]
  );

  //Recursive function call to construct metric path and label object from options tree.
  const metricPathAndLabel = useMemo(
    () => (!metricPath && options.length ? getMetricPathAndLabel(options, metric, entityType) : {}),
    [options, metric, entityType, metricPath]
  );

  // Updating metric path and label in edit scenario
  if (metric && !metricLabel && !metricPath?.length) {
    metricLabel = metricPathAndLabel?.label ?? getMetricLabel;
    metricPath =
      metricPathAndLabel?.path && metricPathAndLabel?.path.length > 0
        ? metricPathAndLabel?.path
        : ['Others', entityLabel];

    updateFormField({
      updateForm,
      form,
      metricLabel: metricLabel,
      metricPath: metricPath,
      clearGroupFilter: false
    });
  }

  const metricMetadata = {
    metric,
    label: metricLabel,
    path: metricPath,
    loading:
      ((metricLabelField && !metricLabel) || !metricPath || metricPath.length == 0) && metricCatalog.progress.loading
  };
  const stableMetricCatalog = catalogQuery.value === catalogQuery.debouncedValue ? metricCatalog : pendingResult;
  const onMetricChange = onMetricChangeMethod();

  const onRegexChange = (regex: string) => {
    if (!isRegex) {
      return;
    }

    updateFormField({
      updateForm,
      form,
      metricLabel: getLabelForRegex(regex),
      metricPath: getPathForRegex(regex),
      metric: regex,
      clearGroupFilter: initialRegex.current && initialRegex.current !== regex ? true : false
    });
  };

  const setIsRegex = (newIsRegex: boolean) => {
    const toPlain = !newIsRegex && isRegex;
    const toRegex = newIsRegex && !isRegex;
    if (toPlain) {
      updateFormField({
        updateForm,
        form,
        metricLabel: '',
        metricPath: [],
        metric: '',
        regex: newIsRegex,
        clearGroupFilter: true
      });
    } else if (toRegex) {
      const escapedRegex = escapeRegExp(metric);
      initialRegex.current = escapedRegex;
      updateFormField({
        updateForm,
        form,
        metricLabel: getLabelForRegex(escapedRegex),
        metricPath: getPathForRegex(escapedRegex),
        metric: escapedRegex,
        regex: newIsRegex
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
        onMetricChange={(metricObj: Node) => onMetricChange(metricObj, form, updateForm, entityType, isTearsheet)}
        query={catalogQuery.value}
        onQueryChange={catalogQuery.onChange}
        selectMetric={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.metric.selectMetric')}
        isRegex={isRegex}
        regex={metric || ''}
        setIsRegex={setIsRegex}
        onRegexChange={onRegexChange}
        onChange={onChange}
        backendQueryModel={backendQueryModel}
        SelectorOverlay={MetricSelectionCategoryOverlay}
        type={entityTypeField?.value}
        onTypeChange={onTypeChange(form, updateForm)}
        onSelectType={onSelectType}
      />
      <TouchedMessages field={metricField} />
      <ValidationMessages form={form} category={regexValidationError} />
    </>
  );
}

interface UpdateFormFieldProp {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  metricLabel?: string;
  metricPath?: string[];
  entityType?: string;
  metric?: string;
  regex?: boolean;
  clearGroupFilter?: boolean;
  isTearsheet?: boolean;
}

function updateFormField({
  updateForm,
  form,
  metricLabel,
  metricPath,
  entityType,
  metric,
  regex,
  clearGroupFilter,
  isTearsheet
}: UpdateFormFieldProp) {
  let updatedForm = form;
  if (typeof metricLabel !== 'undefined') {
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

  if (typeof metric !== 'undefined') {
    updatedForm = updatedForm.updateIn(['rule', 'metricName'], field =>
      (field as Field<string>).setValue(metric).setTouched(true)
    );
  }
  if (typeof regex !== 'undefined') {
    updatedForm = updatedForm.updateIn(['rule', 'regex'], field =>
      (field as Field<boolean>).setValue(regex).setTouched(true)
    );
  }
  if (clearGroupFilter) {
    updatedForm = updatedForm
      .updateIn(['groupBy'], field => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn(['tagFilterExpression'], field => (field as Field<string[]>).setValue([]).setTouched(true));
  }
  if (isTearsheet) {
    const selectedChannelsArray = form.get('hiddenFields').get('selectedChannelList').value;
    if (selectedChannelsArray.length > 0) {
      updatedForm = updatedForm.updateIn(['alertChannels'], field =>
        field
          .setValue({
            WARNING: [...selectedChannelsArray],
            CRITICAL: []
          })
          .setTouched(true)
      );
    }
  }

  updateForm(updatedForm);
}

function onMetricChangeMethod() {
  return (
    metricObj: Node,
    form: MapForm<any>,
    updateForm: (form: MapForm<any>) => void,
    entityType: string,
    isTearsheet: boolean
  ) => {
    updateFormField({
      updateForm,
      form,
      metricLabel: metricObj.label,
      metricPath: metricObj.parentLabels,
      metric: metricObj.metric,
      entityType: metricObj.levelType,
      clearGroupFilter: entityType == metricObj.levelType ? false : true,
      isTearsheet
    });
  };
}

function onTypeChange(form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  return (type: string) => {
    updateFormField({
      updateForm,
      form,
      entityType: type,
      clearGroupFilter: true
    });
  };
}
