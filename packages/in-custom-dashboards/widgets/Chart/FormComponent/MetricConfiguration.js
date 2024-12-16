/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, Li, SvgIcon, Pill } from '@instana/components';
import { create } from '@instana/observables';

import {
  formatterPath,
  metricsPath,
  unitPath,
  useChartFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { source as sliSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import { duplicate, onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { isInitiallyOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import TimeShiftingForm from 'in-custom-dashboards/widgets/Chart/FormComponent/TimeShiftingForm';
import { getCommonFormatterForUnits } from 'in-custom-dashboards/widgets/_shared/formatters';
import ThresholdForm from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdForm';
import { getMetricId, getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { HighlightedEffect } from 'in-components/SelectedElementHighlighter';
import useSubForm from 'in-custom-dashboards/widgets/_shared/useSubForm';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { getBaseUnit } from 'in-stores/metric/units';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './MetricConfiguration.mless';

export const refreshDFQ$ = create().emit();

export const columnDefinitions = [
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ index, axisName, indexInAxis, getShortMetricKey }) {
      return (
        <Pill kind="info" id={getMetricId(index)}>
          {getShortMetricKey(axisName, indexInAxis)}
        </Pill>
      );
    }
  },
  {
    getContent({ metricForm }) {
      let title = getMetricLabel(metricForm.toJS());
      if (metricForm.get('timeShift').value !== 0) {
        title = (
          <Tooltip content={t('in-custom-dashboards:widgets.formCompChart.metricConfigChart.datasetTimeShift')}>
            <span className={locals.timeShifted}>
              {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
            </span>
          </Tooltip>
        );
      }

      return (
        <div
          className={classNames(locals.title, {
            [locals.hasError]: metricForm.touched && !metricForm.hierarchyValid
          })}
        >
          {title}
        </div>
      );
    }
  },
  {
    forceMinimumWidth: true,
    shrink: false,
    getContent({ onChange, axisName, indexInAxis, metricForm }) {
      return (
        <MoreMenu kind="subtle" className={locals.more}>
          <MoreMenuButton
            icon="lib_actions_copy"
            onClick={() =>
              onChange([axisName, 'metrics'], f => f.insert(indexInAxis + 1, duplicate(metricForm)).setTouched(true))
            }
          >
            {t('in-custom-dashboards:widgets.formCompChart.metricConfigChart.duplicate')}
          </MoreMenuButton>
          <MoreMenuButton
            icon="lib_actions_delete"
            requireTitle
            title={t('in-custom-dashboards:widgets.formCompChart.metricConfigChart.removeDataset')}
            onClick={() => {
              onChange([axisName, 'metrics'], f => f.remove(indexInAxis).setTouched(true));
              refreshDFQ$.emit(true);
            }}
          >
            {t('in-custom-dashboards:widgets.formCompChart.metricConfigChart.removeDataset')}
          </MoreMenuButton>
        </MoreMenu>
      );
    }
  }
];

export default function MetricConfiguration(props) {
  const {
    axisName,
    index,
    indexInAxis,
    onChange,
    metricForm,
    form,
    type,
    dataSource,
    formatterSection,
    withFiltering = true,
    withGrouping = true,
    withTimeShift = true,
    isTypePrefilled = false,
    displayDFQ = true,
    withLastValue = false,
    withEmptyValueFilterSection,
    withUnit = false,
    withThreshold = false
  } = props;

  const updateForm = useChartFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  const { form: thresholdForm, update: updateThresholdForm } = useSubForm({
    form,
    path: [axisName, metricsPath, indexInAxis, 'threshold'],
    updateForm
  });

  const unitField = metricForm.get(unitPath);
  const baseUnit = unitForInfraMetricsEnabled ? getBaseUnit(unitField?.value) : undefined;
  const metricFormatter = baseUnit
    ? getCommonFormatterForUnits(baseUnit)?.[0]?.id
    : metricForm.get(formatterPath)?.value;

  return (
    <HighlightedEffect id={getMetricId(index)}>
      {({ highlighted, ref }) => (
        <Li
          className={classNames({
            [locals.highlighted]: highlighted
          })}
          ref={ref}
          noAlternatingBg
          toggleContentOnRowClick
          highlightOpenState={false}
          initiallyOpen={isInitiallyOpen(axisName, indexInAxis)}
          renderNestedContent={() => (
            <MetricConfigurator
              form={metricForm}
              onChange={(path, fn) => {
                updateForm(form.updateIn([axisName, metricsPath, indexInAxis, ...path], fn));
              }}
              updateForm={updateForm}
              onChangeSource={newSource =>
                onChangeSource(
                  metricForm,
                  metricConfigurationForm =>
                    updateForm(form.updateIn([axisName, metricsPath, indexInAxis], () => metricConfigurationForm)),
                  newSource
                )
              }
              timeShiftConfiguration={
                withTimeShift ? (
                  <TimeShiftingForm
                    axisName={axisName}
                    index={index}
                    indexInAxis={indexInAxis}
                    onChange={onChange}
                    metricForm={metricForm}
                  />
                ) : undefined
              }
              formatterSection={formatterSection}
              disabledDataSources={[sliSource]}
              axisForm={form}
              axisName={axisName}
              withLabelConfiguration
              withPotentialProblemsConfiguration
              withFiltering={withFiltering}
              withGrouping={withGrouping}
              dataSource={dataSource}
              isTypePrefilled={isTypePrefilled}
              type={type}
              displayDFQ={displayDFQ}
              withLastValue={withLastValue}
              withEmptyValueFilterSection={withEmptyValueFilterSection}
              withUnit={withUnit}
              thresholdConfiguration={
                withThreshold && (
                  <ThresholdForm form={thresholdForm} updateForm={updateThresholdForm} formatter={metricFormatter} />
                )
              }
            />
          )}
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} {...props} />
        </Li>
      )}
    </HighlightedEffect>
  );
}
